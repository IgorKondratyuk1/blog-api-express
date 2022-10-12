import {UserDBType, UserType} from "../types/user-types";
import bcrypt from 'bcrypt';
import {v4 as uuidv4} from 'uuid';
import {usersRepository} from "../repositories/users/users-repository";
import {ObjectId} from "mongodb";
import {ViewUserModel} from "../models/user/view-user-model";

export const usersService = {
    async createUser(login: string, password: string, email: string): Promise<ViewUserModel> {
        const passwordSalt: string = await bcrypt.genSalt(10);
        const passwordHash: string = await this._generateHash(password, passwordSalt);

        const newUser: UserDBType = {
            _id: new ObjectId(),
            id: uuidv4(),
            createdAt: (new Date()).toISOString(),
            login: login,
            email: email,
            passwordHash: passwordHash
        }

        const createdUser: UserType = await usersRepository.createUser(newUser);
        return this._mapUserTypeToViewUserModel(createdUser);
    },
    async findUserById(id: string): Promise<UserType | null> {
        return await usersRepository.findUserById(id);
    },
    async deleteUser(id: string): Promise<boolean> {
        return await usersRepository.deleteUser(id);
    },
    async deleteAllUsers() {
        return usersRepository.deleteAllUsers();
    },
    async checkCredentials(password: string, userLogin: string): Promise<UserType | null> {
        const user: UserType | null = await usersRepository.findUserByLogin(userLogin);
        if (!user) return null;

        const haveCredentials = await bcrypt.compare(password, user.passwordHash);
        if (haveCredentials) {
            return user;
        } else {
            return null;
        }
    },
    async _generateHash(password: string, salt: string): Promise<string> {
        return await bcrypt.hash(password, salt);
    },
    _mapUserTypeToViewUserModel(user: UserType): ViewUserModel {
        return {
            id: user.id,
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
    }
}