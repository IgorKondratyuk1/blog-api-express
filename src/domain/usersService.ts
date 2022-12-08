import bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';
import {ObjectId} from "mongodb";
import {add} from "date-fns";
import {PasswordRecoveryType, UserAccountDbType, UserAccountType} from "../types/userTypes";
import {usersRepository} from "../repositories/users/usersRepository";

export const usersService = {
    async findUserById(id: string): Promise<UserAccountType | null> {
        return await usersRepository.findUserById(id);
    },
    async createUser(login: string, email: string, password: string, isConfirmed: boolean = false): Promise<UserAccountType | null> {
        const passwordHash: string = await this._generateHash(password);
        const newUser: UserAccountDbType = {
            _id: new ObjectId(),
            id: uuidv4(),
            accountData: {
                login,
                email,
                passwordHash,
                createdAt: (new Date()).toISOString()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                }).toISOString(),
                isConfirmed: isConfirmed
            },
            passwordRecovery: {}
        }

        const createdUser: UserAccountType | null = await usersRepository.createUser(newUser);
        return createdUser;
    },
    async updateRecoveryCode(id: string): Promise<UserAccountType | null> {
        const recoveryData: PasswordRecoveryType = {
            recoveryCode: uuidv4(),
            expirationDate: add(new Date(), {
                hours: 1,
                minutes: 3
            }).toISOString(),
            isUsed: false
        };
        return await usersRepository.updatePasswordRecoveryCode(id, recoveryData);
    },
    async updateUserPassword(id: string, newPassword: string): Promise<boolean> {
        const newPasswordHash: string = await this._generateHash(newPassword);
        return await usersRepository.updateUserPassword(id, newPasswordHash);
    },
    async deleteUser(id: string): Promise<boolean> {
        return await usersRepository.deleteUser(id);
    },
    async deleteAllUsers() {
        return usersRepository.deleteAllUsers();
    },
    async _generateHash(password: string): Promise<string> {
        const passwordSalt: string = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, passwordSalt);
    }
}