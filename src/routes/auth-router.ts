import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {RequestWithBody} from "../types/types";
import {LoginInputModel} from "../models/auth/login/login-input-model";
import {jwtService} from "../application/jwt-service";
import {UserAccountType, UserType} from "../types/user-types";
import {jwtAuthMiddleware} from "../middlewares/jwt-auth-middlewsre";
import {getMeViewModel} from "../helpers/helpers";
import {HTTP_STATUSES} from "../index";
import {userLoginValidationSchema} from "../schemas/auth/login-schema";
import {userRegistrationValidationSchema} from "../schemas/auth/user-registration";
import {CreateUserModel} from "../models/user/create-user-model";
import {authService} from "../domain/auth-service";
import {RegisrationConfirmationCodeModel} from "../models/auth/registration/regisration-confirmation-code-model";
import {registrationConfirmationValidationSchema} from "../schemas/auth/registration-confirmation-schema";
import {registrationEmailResendingValidationSchema} from "../schemas/auth/registration-email-resending";
import {RegistrationEmailResendingModel} from "../models/auth/registration/registration-email-resending-model";
import {SETTINGS} from "../config";
import {checkRefreshTokenMiddleware} from "../middlewares/check-refresh-token-middleware";
import {refreshTokensRepository} from "../repositories/auth/auth-repository";

export const authRouter = Router({});

authRouter.post("/registration",
    userRegistrationValidationSchema,
    async (req: RequestWithBody<CreateUserModel>, res: Response) => {
        const user: UserAccountType | null = await authService.saveUser(req.body.login, req.body.email, req.body.password);

        if (user) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        }
});

authRouter.post("/registration-confirmation",
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
   userLoginValidationSchema,
    async (req: RequestWithBody<LoginInputModel>, res: Response) => {
    const user: UserAccountType | null = await authService.checkCredentials(req.body.password, req.body.login);

    if (user) {
        const accessToken: string = await jwtService.createJWT({userId: user.id}, SETTINGS.JWT_SECRET, Number(SETTINGS.ACCESS_TOKEN_EXPIRATION));
        //const refreshCode: string = await authService.generateRefreshTokenCode();
        const refreshToken: string = await jwtService.createJWT({userId: user.id}, SETTINGS.JWT_SECRET, Number(SETTINGS.REFRESH_TOKEN_EXPIRATION));

        res.cookie('refreshToken', refreshToken,
            {
            httpOnly: true,
            //secure: true,
            maxAge: Number(SETTINGS.REFRESH_TOKEN_EXPIRATION) * 1000 // ms
        });
        res.json({
            accessToken
        });
    } else {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    }
});

authRouter.post("/refresh-token",
    checkRefreshTokenMiddleware,
    async (req: Request, res: Response) => {
        if (!req.user?.id) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        }

        const user: UserAccountType | null = await usersService.findUserById(req.user!.id);

        if (user) {
            const accessToken: string = await jwtService.createJWT({userId: user.id}, SETTINGS.JWT_SECRET, Number(SETTINGS.ACCESS_TOKEN_EXPIRATION));
            const refreshToken: string = await jwtService.createJWT({userId: user.id}, SETTINGS.JWT_SECRET, Number(SETTINGS.REFRESH_TOKEN_EXPIRATION));

            await authService.addRefreshTokenToBlackList(req.cookies.refreshToken); // Refresh token not valid

            res.cookie('refreshToken', refreshToken,
                {
                    httpOnly: true,
                    //secure: true,
                    maxAge: Number(SETTINGS.REFRESH_TOKEN_EXPIRATION) * 1000 // ms
            });
            res.json({
                accessToken
            });
        } else {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        }
    });

authRouter.get("/me",
    jwtAuthMiddleware,
    async (req: Request, res: Response) => {

    const user: UserAccountType | null = await usersService.findUserById(req.user!.id);

    if (!user) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }

    res.json(getMeViewModel(user));
});

authRouter.post("/logout",
    checkRefreshTokenMiddleware,
    async (req: Request, res: Response) => {
        console.log('Logout');
        console.log(req.cookies);
        await authService.addRefreshTokenToBlackList(req.cookies.refreshToken); // Refresh token not valid
        res.clearCookie('refreshToken');
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    });