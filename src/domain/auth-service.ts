import {
    UserAccountType
} from "../types/user-types";
import {usersRepository} from "../repositories/users/users-repository";
import bcrypt from "bcrypt";
import {emailManager} from "../manager/email-managers";
import {usersService} from "./users-service";

export const authService = {
    async saveUser(login: string, email: string, password: string): Promise<UserAccountType | null> {
        const createdUser: UserAccountType = await usersService.createUser(login, email, password);

        try {
            await emailManager.sendEmailConfirmationMessage(createdUser);
            return createdUser;
        } catch (error) {
            console.error(error);
            await usersRepository.deleteUser(createdUser.id);
            return null;
        }
    },
    async checkCredentials(password: string, userLoginOrEmail: string): Promise<UserAccountType | null> {
        try {
            const user: UserAccountType | null = await usersRepository.findUserByLoginOrEmail(userLoginOrEmail);
            if (!user) return null;
            if (!user.emailConfirmation.isConfirmed) return null;

            const haveCredentials = await this._isPasswordCorrect(password, user.accountData.passwordHash);
            if (haveCredentials) {
                return user;
            } else {
                return null;
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    },
    async confirmEmail(code: string): Promise<boolean> {
        const user: UserAccountType | null = await usersRepository.findUserByConfirmationCode(code);
        if (!user) return false;
        if (user.emailConfirmation.isConfirmed) return false;
        if (new Date(user.emailConfirmation.expirationDate) < new Date()) return false;

        return await usersRepository.confirmUserEmail(user.id);
    },
    async emailResending(email: string): Promise<boolean> {
        const user: UserAccountType | null = await usersRepository.findUserByLoginOrEmail(email);
        if (!user) return false;
        if (user.emailConfirmation.isConfirmed) return false;

        try {
            await emailManager.sendEmailConfirmationMessage(user);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    },
    async _generateHash(password: string): Promise<string> {
        const passwordSalt: string = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, passwordSalt);
    },
    async _isPasswordCorrect(password: string, passwordHash: string): Promise<boolean> {
       return await bcrypt.compare(password, passwordHash);
    }
}