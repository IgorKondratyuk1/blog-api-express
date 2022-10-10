import {UserDBType, UserType} from "../../types/user-types";
import {usersCollection} from "../db";

export const usersRepository = {
    async findUserById(id: string): Promise<UserType | null> {
        const dbUser: UserDBType | null = await usersCollection.findOne({id: id});
        if (!dbUser) return null;
        return this._mapUserDBTypeToUserType(dbUser);
    },
    async findUserByLogin(login: string): Promise<UserType | null> {
        const dbUser: UserDBType | null = await usersCollection.findOne({userName: login});
        if (!dbUser) return null
        return this._mapUserDBTypeToUserType(dbUser);
    },
    async createUser(newUser: UserDBType): Promise<UserType> {
        await usersCollection.insertOne(newUser);
        return this._mapUserDBTypeToUserType(newUser);
    },
    async deleteUser(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id: id});
        return result.deletedCount === 1;
    },
    async deleteAllUsers() {
        return usersCollection.deleteMany({});
    },
    _mapUserDBTypeToUserType(dbUser: UserDBType): UserType {
        return {
            id: dbUser.id,
            email: dbUser.email,
            login: dbUser.login,
            passwordHash: dbUser.passwordHash,
            createdAt: dbUser.createdAt
        }
    }
}