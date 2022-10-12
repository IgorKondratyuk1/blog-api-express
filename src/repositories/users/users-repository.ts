import {UserDBType, UserType} from "../../types/user-types";
import {usersCollection} from "../db";

export const usersRepository = {
    async findUserById(id: string): Promise<UserType | null> {
        const dbUser: UserDBType | null = await usersCollection.findOne({id: id});
        if (!dbUser) return null;
        return this._mapUserDbTypeToUserType(dbUser);
    },
    async findUserByLogin(login: string): Promise<UserType | null> {
        const dbUser: UserDBType | null = await usersCollection.findOne({login: login});
        if (!dbUser) return null
        return this._mapUserDbTypeToUserType(dbUser);
    },
    async createUser(newUser: UserDBType): Promise<UserType> {
        await usersCollection.insertOne(newUser);
        return this._mapUserDbTypeToUserType(newUser);
    },
    async deleteUser(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id: id});
        return result.deletedCount === 1;
    },
    async deleteAllUsers() {
        return usersCollection.deleteMany({});
    },
    _mapUserDbTypeToUserType(dbUser: UserDBType): UserType {
        return {
            id: dbUser.id,
            email: dbUser.email,
            login: dbUser.login,
            passwordHash: dbUser.passwordHash,
            createdAt: dbUser.createdAt
        }
    }
}