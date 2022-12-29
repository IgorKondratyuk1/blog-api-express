import {authError, AuthService} from "../../domain/authService";
import {UsersService} from "../../domain/usersService";
import {RequestWithBody, TokensPair} from "../../types/types";
import {LoginInputModel} from "../../models/auth/login/loginInputModel";
import {Request, Response} from "express";
import {HTTP_STATUSES} from "../../index";
import {cookiesSettings} from "../../helpers/helpers";
import {CreateUserModel} from "../../models/user/createUserModel";
import {RegistrationConfirmationCodeModel} from "../../models/auth/registration/regisrationConfirmationCodeModel";
import {RegistrationEmailResendingModel} from "../../models/auth/registration/registrationEmailResendingModel";
import {PasswordRecoveryModel} from "../../models/auth/registration/passwordRecoveryModel";
import {NewPasswordModel} from "../../models/auth/registration/newPasswordModel";
import {UserAccountType} from "../../repositories/users/userSchema";
import {mapUserAccountTypeToMeViewModel} from "../../helpers/mappers";

export class AuthController {
    constructor(
        protected authService: AuthService,
        protected usersService: UsersService
    ) {
    }

    async login(req: RequestWithBody<LoginInputModel>, res: Response) {
        const ip: string = req.ip || "";
        const title: string = req.headers['user-agent'] || "";
        const result: TokensPair | authError = await this.authService.login(ip, title, req.body.password, req.body.loginOrEmail);

        switch (result) {
            case authError.BadRequestError:
            case authError.CreationError:
            case authError.TokenError:
                res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
                return;
            case authError.WrongUserError:
            case authError.NotFoundError:
                res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
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
    }

    async registration(req: RequestWithBody<CreateUserModel>, res: Response) {
        const result: authError = await this.authService.register(req.body.login, req.body.email, req.body.password);

        switch (result) {
            case authError.Success:
                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
                break;
            default:
                res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
                break;
        }
    }

    async registrationConfirmation(req: RequestWithBody<RegistrationConfirmationCodeModel>, res: Response) {
        const result: boolean = await this.authService.confirmEmail(req.body.code);
        if (result) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        }
    }

    async registrationEmailResending(req: RequestWithBody<RegistrationEmailResendingModel>, res: Response) {
        const result: boolean = await this.authService.resendConfirmCode(req.body.email);
        if (result) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        }
    }

    async refreshToken(req: Request, res: Response) {
        if (!req.user?.id) res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);

        const result: TokensPair | authError = await this.authService.refreshTokens({
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
    }

    async passwordRecovery(req: RequestWithBody<PasswordRecoveryModel>, res: Response) {
        await this.authService.sendRecoveryCode(req.body.email);
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }

    async newPassword(req: RequestWithBody<NewPasswordModel>, res: Response) {
        const result: boolean = await this.authService.confirmNewPassword(req.body.newPassword, req.body.recoveryCode);

        if (result) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        }
    }

    async logout(req: Request, res: Response) {
        console.log('Logout');
        console.log(req.cookies);

        await this.authService.logout(req.user.id, req.deviceId); // Refresh token not valid
        res.clearCookie('refreshToken');
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }

    async me(req: Request, res: Response) {

        const user: UserAccountType | null = await this.usersService.findUserById(req.user!.id);

        if (!user) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        res.json(mapUserAccountTypeToMeViewModel(user));
    }
}