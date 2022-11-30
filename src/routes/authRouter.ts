import {Request, Response, Router} from "express";
import {RequestWithBody, TokensPair} from "../types/types";
import {UserAccountType} from "../types/userTypes";
import {HTTP_STATUSES} from "../index";
import {CreateUserModel} from "../models/user/createUserModel";
import {userRegistrationValidationSchema} from "../schemas/auth/userRegistration";
import {RegisrationConfirmationCodeModel} from "../models/auth/registration/regisrationConfirmationCodeModel";
import {registrationConfirmationValidationSchema} from "../schemas/auth/registrationConfirmationSchema";
import {LoginInputModel} from "../models/auth/login/loginInputModel";
import {userLoginValidationSchema} from "../schemas/auth/loginSchema";
import {RegistrationEmailResendingModel} from "../models/auth/registration/registrationEmailResendingModel";
import {registrationEmailResendingValidationSchema} from "../schemas/auth/registrationEmailResending";
import {authError, authService} from "../domain/authService";
import {cookiesSettings} from "../helpers/helpers";
import {checkRefreshTokenMiddleware} from "../middlewares/checkRefreshTokenMiddleware";
import {jwtAuthMiddleware} from "../middlewares/jwtAuthMiddlewsre";
import {usersService} from "../domain/usersService";
import {mapUserAccountTypeToMeViewModel} from "../helpers/mappers";
import {requestsLimiterMiddleware} from "../middlewares/requestsLimiterMiddleware";

export const authRouter = Router({});

authRouter.post("/registration",
    requestsLimiterMiddleware,
    userRegistrationValidationSchema,
    async (req: RequestWithBody<CreateUserModel>, res: Response) => {
        const result: authError = await authService.register(req.body.login, req.body.email, req.body.password);

        switch (result) {
            case authError.Success:
                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
                break;
            default:
                res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
                break;
        }
});

authRouter.post("/registration-confirmation",
    requestsLimiterMiddleware,
    registrationConfirmationValidationSchema,
    async (req: RequestWithBody<RegisrationConfirmationCodeModel>, res: Response) => {
        const result: boolean = await authService.confirmEmail(req.body.code);
        if (result) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        }
    });

authRouter.post("/registration-email-resending",
    requestsLimiterMiddleware,
    registrationEmailResendingValidationSchema,
    async (req: RequestWithBody<RegistrationEmailResendingModel>, res: Response) => {
        const result: boolean = await authService.resendConfirmCode(req.body.email);
        if (result) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        }
    });

authRouter.post("/login",
    requestsLimiterMiddleware,
    userLoginValidationSchema,
    async (req: RequestWithBody<LoginInputModel>, res: Response) => {
        const ip: string = req.ip || "";
        const title: string = req.headers['user-agent'] || "";
        const result: TokensPair | authError = await authService.login(ip, title, req.body.password, req.body.loginOrEmail);

        switch (result) {
            case authError.BadRequestError:
                res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
                return;
            case authError.WrongUserError:
                res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
                return;
            case authError.NotFoundError:
                res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
                return;
            case authError.CreationError:
                res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
                return;
            case authError.TokenError:
                res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
                return;
        }

        if (result) {
            res.cookie('refreshToken', result.refreshToken, cookiesSettings());
            res.json({
                accessToken: result.accessToken
            });
        } else {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        }
});

authRouter.post("/refresh-token",
    checkRefreshTokenMiddleware,
    async (req: Request, res: Response) => {
        if (!req.user?.id) res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        try {
            const result: TokensPair | authError = await authService.refreshTokens({
                userId: req.user.id,
                deviceId: req.deviceId,
                issuedAt: req.issuedAt
            });

            switch (result) {
                case authError.BadRequestError:
                    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
                    return;
                case authError.WrongUserError:
                    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
                    return;
                case authError.NotFoundError:
                    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
                    return;
                case authError.CreationError:
                    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
                    return;
                case authError.TokenError:
                    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
                    return;
            }

            if (result) {
                res.cookie('refreshToken', result.refreshToken, cookiesSettings());
                res.json({
                    accessToken: result.accessToken
                });
            } else {
                res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            }
        }catch(e){console.log(e)}
    });

authRouter.get("/me",
    jwtAuthMiddleware,
    async (req: Request, res: Response) => {

    const user: UserAccountType | null = await usersService.findUserById(req.user!.id);

    if (!user) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }

    res.json(mapUserAccountTypeToMeViewModel(user));
});

authRouter.post("/logout",
    checkRefreshTokenMiddleware,
    async (req: Request, res: Response) => {
        console.log('Logout');
        console.log(req.cookies);

        await authService.logout(req.user!.id, req.deviceId); // Refresh token not valid
        res.clearCookie('refreshToken');
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    });