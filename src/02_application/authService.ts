import {v4 as uuidv4} from 'uuid';
import {TokensPair} from "../types/types";
import {SecurityError, SecurityService} from "./securityService";
import {UsersRepository} from "../repositories/users/usersRepository";
import {createTokensPair} from "../helpers/createTokensPair";
import {JWTDataType} from "./jwtService";
import {emailManager} from "../manager/emailManagers";
import {SecurityRepository} from "../repositories/security/securityRepository";
import {UsersService} from "./usersService";
import {inject, injectable} from "inversify";
import {HydratedUser} from "../01_domain/User/UserTypes";
import {DeviceType, HydratedDevice} from "../01_domain/Security/securityTypes";

export enum authError {
    Success,
    CreationError,
    WrongUserError,
    NotFoundError,
    TokenError,
    BadRequestError
}

@injectable()
export class AuthService {
    constructor(
        @inject(SecurityRepository) protected securityRepository: SecurityRepository,
        @inject(UsersRepository) protected usersRepository: UsersRepository,
        @inject(UsersService) protected usersService: UsersService,
        @inject(SecurityService) protected securityService: SecurityService
    ) {}

    async register(login: string, email: string, password: string): Promise<authError> {
        // 1. Create new user
        const createdUser = await this.usersService.createUser(login, email, password);
        if (!createdUser) return authError.CreationError;

        try {
            // 2. Try to send password confirmation email
            await emailManager.sendEmailConfirmationMessage(createdUser);
        } catch (error) {
            // 2.1. If Error occurred, then delete user
            console.error(error);
            await this.usersRepository.deleteUser(createdUser.id);
            return authError.CreationError;
        }

        return authError.Success;
    }
    async login(ip: string, title: string, password: string, userLoginOrEmail: string): Promise<TokensPair | authError> {
        // 1. Get user
        const user: HydratedUser | null | undefined = await this.usersRepository.findUserByLoginOrEmail(userLoginOrEmail);
        if (!user) return authError.NotFoundError;
        if (!user.emailConfirmation.isConfirmed) return authError.BadRequestError;

        // 2. Check users credentials
        if (!user.isPasswordCorrect(password)) return authError.WrongUserError;

        // 3. Create device session
        const createdSession: HydratedDevice | null = await this.securityService.createDeviceSession(user.id, ip, title);
        if (!createdSession) return authError.CreationError;

        const tokensPair = createTokensPair(createdSession);
        return tokensPair;
    }
    async logout(userId: string, deviceId: string): Promise<SecurityError> {
        const result: SecurityError = await this.securityService.deleteDeviceSession(userId, deviceId);
        return result;
    }
    // TODO refactor device session
    async getRefreshAccessTokens(tokenPayload: JWTDataType): Promise<TokensPair | authError> {
        const {deviceId, userId, issuedAt} = tokenPayload;
        if (!deviceId || !userId || !issuedAt) return authError.WrongUserError;

        // 1. Search user
        const user: HydratedUser | null | undefined = await this.usersRepository.findUserById(userId);
        if (!user) return authError.WrongUserError;

        // 2. Search user`s device session
        const deviceSession: HydratedDevice | null = await this.securityService.findDeviceSession(deviceId);
        if (!deviceSession) return authError.WrongUserError;

        // 3. Check version of refresh token by issued Date (issued Date like unique version of refresh token)
        if (deviceSession.issuedAt !== issuedAt) return authError.TokenError;

        // 4. Update refresh token issued Date
        await deviceSession.setIssuedDate((new Date()).toISOString())
        await this.securityRepository.save(deviceSession);

        // 5. Get updated Device Session
        // const updatedSession: HydratedDevice | null | undefined = await this.securityRepository.findDeviceSession(deviceId);
        // if (!updatedSession) return authError.BadRequestError;

        const tokensPair: TokensPair = await createTokensPair(deviceSession);
        return tokensPair;
    }
    async confirmEmail(code: string): Promise<boolean> {
        const user: HydratedUser | null | undefined = await this.usersRepository.findUserByEmailConfirmationCode(code);
        if (!user) return false;

        if (user.canBeConfirmed(code)) {
            await user.confirm(code);
            await this.usersRepository.save(user);
            return true;
        }

        return false;
    }
    async resendConfirmCode(email: string): Promise<boolean> {
        const user: HydratedUser | null | undefined = await this.usersRepository.findUserByLoginOrEmail(email);
        if (!user) return false;
        if (user.emailConfirmation.isConfirmed) return false;

        await user.setEmailConfirmationCode(uuidv4());
        await this.usersRepository.save(user);

        try {
            await emailManager.sendEmailConfirmationMessage(user);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
    async sendRecoveryCode(email: string): Promise<boolean> {
        const user: HydratedUser | null | undefined = await this.usersRepository.findUserByLoginOrEmail(email);
        if (!user) return false;

        await user.createNewPasswordRecoveryCode();
        await this.usersRepository.save(user);

        try {
            await emailManager.sendPasswordRecoveryMessage(user);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
    async confirmNewPassword(newPassword: string, recoveryCode: string): Promise<boolean> {
        const user: HydratedUser | null | undefined = await this.usersRepository.findUserByPasswordConfirmationCode(recoveryCode);
        if (!user) return false;

        await user.setPassword(newPassword);
        await this.usersRepository.save(user);
        return true;
    }
}