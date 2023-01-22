import bcrypt from "bcrypt";
import {v4 as uuidv4} from 'uuid';
import {TokensPair} from "../types/types";
import {SecurityError, SecurityService} from "./securityService";
import {UsersRepository} from "../repositories/users/usersRepository";
import {createTokensPair} from "../helpers/createTokensPair";
import {JWTDataType} from "../application/jwtService";
import {emailManager} from "../manager/emailManagers";
import {UserAccountType} from "../repositories/users/userSchema";
import {DeviceType} from "../repositories/security/securitySchema";
import {SecurityRepository} from "../repositories/security/securityRepository";
import {UsersService} from "./usersService";
import {inject, injectable} from "inversify";

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
        const createdUser: UserAccountType | null = await this.usersService.createUser(login, email, password);
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
        const user: UserAccountType | null = await this.usersRepository.findUserByLoginOrEmail(userLoginOrEmail);

        if (!user) return authError.NotFoundError;
        if (!user.emailConfirmation.isConfirmed) return authError.BadRequestError;

        // 2. Check users credentials
        const haveCredentials = await this._isPasswordCorrect(password, user.accountData.passwordHash);
        if (!haveCredentials) return authError.WrongUserError;

        // 3. Create device session
        const createdSession: DeviceType | null = await this.securityService.createDeviceSession(user.id, ip, title);
        if (!createdSession) return authError.CreationError;

        const tokensPair = createTokensPair(createdSession);
        return tokensPair;
    }
    async logout(userId: string, deviceId: string): Promise<SecurityError> {
        const result: SecurityError = await this.securityService.deleteDeviceSession(userId, deviceId);
        return result;
    }
    async refreshTokens(tokenPayload: JWTDataType): Promise<TokensPair | authError> {
        const {deviceId, userId, issuedAt} = tokenPayload;
        if (!deviceId || !userId || !issuedAt) return authError.WrongUserError;

        // 1. Search user
        const user: UserAccountType | null = await this.usersService.findUserById(userId);
        if (!user) return authError.WrongUserError;

        // 2. Search user`s device session
        const foundedSession: DeviceType | null = await this.securityService.findDeviceSession(deviceId);
        if (!foundedSession) return authError.WrongUserError;

        // 3. Check version of refresh token by issued Date (issued Date like unique version of refresh token)
        if (foundedSession.issuedAt !== issuedAt) return authError.TokenError;

        // 4. Update refresh token issued Date
        const update: boolean = await this.securityRepository.updateDeviceSessionIssuedDate(deviceId, (new Date()).toISOString());
        if (!update) return authError.BadRequestError;

        // 5. Get updated Device Session
        const updatedSession: DeviceType | null = await this.securityRepository.findDeviceSession(deviceId);
        if (!updatedSession) return authError.BadRequestError;

        const tokensPair: TokensPair = await createTokensPair(updatedSession);
        return tokensPair;
    }
    async confirmEmail(code: string): Promise<boolean> {
        const user: UserAccountType | null = await this.usersRepository.findUserByEmailConfirmationCode(code);
        if (!user) return false;
        if (user.emailConfirmation.isConfirmed) return false;
        if (new Date(user.emailConfirmation.expirationDate) < new Date()) return false;

        return await this.usersRepository.confirmUserEmail(user.id);
    }
    async resendConfirmCode(email: string): Promise<boolean> {
        const user: UserAccountType | null = await this.usersRepository.findUserByLoginOrEmail(email);
        if (!user) return false;
        if (user.emailConfirmation.isConfirmed) return false;

        // Update code with new uuid
        const updatedUser = await this.usersRepository.updateUserConfirmCode(user.id, uuidv4());
        if (!updatedUser) return false;

        try {
            await emailManager.sendEmailConfirmationMessage(updatedUser);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
    // recovery password
    async sendRecoveryCode(email: string): Promise<boolean> {
        const user: UserAccountType | null = await this.usersRepository.findUserByLoginOrEmail(email);
        if (!user) return false;

        const updatedUser: UserAccountType | null = await this.usersService.updateRecoveryCode(user.id);
        if (!updatedUser) return false;

        try {
            await emailManager.sendPasswordRecoveryMessage(updatedUser);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
    async confirmNewPassword(newPassword: string, recoveryCode: string): Promise<boolean> {
        const user: UserAccountType | null = await this.usersRepository.findUserByPasswordConfirmationCode(recoveryCode);

        // Validation
        if (!user || !user.passwordRecovery) return false;
        if (user.passwordRecovery.isUsed) return false;
        if (new Date(user.emailConfirmation.expirationDate) < new Date()) return false;

        return await this.usersService.updateUserPassword(user.id, newPassword);
    }
    async _isPasswordCorrect(password: string, passwordHash: string): Promise<boolean> {
       return await bcrypt.compare(password, passwordHash);
    }
}