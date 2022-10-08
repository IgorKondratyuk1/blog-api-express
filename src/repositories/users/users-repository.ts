import {UserDBType, UserType} from "../../types/user-types";
import {usersCollection} from "../db";

export const usersRepository = {
    async findUserById(id: string): Promise<UserDBType | null> {
        const dbUser: UserDBType | null = await usersCollection.findOne({id: id});
        return dbUser;
    },
    async findUserByLogin(login: string): Promise<UserDBType | null> {
        const dbUser: UserDBType | null = await usersCollection.findOne({userName: login});
        return dbUser;
    },
    async createUser(newUser: UserDBType): Promise<UserDBType> {
        await usersCollection.insertOne(newUser);
        return newUser;
    },
    async deleteUser(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id: id});
        return result.deletedCount === 1 ? true : false;
    },
    _mapUserDBTypeToUserType(dbUser: UserDBType): UserType {
        return {
            id: dbUser.id,
            email: dbUser.email,
            login: dbUser.userName,
            passwordHash: dbUser.passwordHash,
            createdAt: dbUser.createdAt
        }
    }
}