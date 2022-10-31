import {UserAccountDbType, UserAccountType, UserDBType, UserType} from "../../types/user-types";
import {usersCollection} from "../db";

export const usersRepository = {
    async findUserById(id: string): Promise<UserAccountType | null> {
        const dbUser: UserAccountDbType | null = await usersCollection.findOne({id: id});
        if (!dbUser) return null;
        return this._mapUserAccountDBTypeToUserAccountType(dbUser);
    },
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserAccountType | null> {
        const dbUser: UserAccountDbType | null = await usersCollection.findOne({$or: [{'accountData.login': loginOrEmail}, {'accountData.email': loginOrEmail}]});
        if (!dbUser) return null
        return this._mapUserAccountDBTypeToUserAccountType(dbUser);
    },
    async findUserByConfirmationCode(code: string) {
        const dbUser: UserAccountDbType | null = await usersCollection.findOne({'emailConfirmation.confirmationCode': code});
        if (!dbUser) return null;
        return this._mapUserAccountDBTypeToUserAccountType(dbUser);
    },
    async createUser(newUser: UserAccountDbType): Promise<UserAccountType | null> {
        const result = await usersCollection.insertOne(newUser);
        if (!result.insertedId) return null;
        return this._mapUserAccountDBTypeToUserAccountType(newUser);
    },
    async deleteUser(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id: id});
        return result.deletedCount === 1;
    },
    async deleteAllUsers() {
        return usersCollection.deleteMany({});
    },
    async confirmUserEmail(id: string) {
        const result = await usersCollection.updateOne({id: id}, {$set: { 'emailConfirmation.isConfirmed': true}});
        return result.modifiedCount === 1;
    },
    async updateUserConfirmCode(id: string, code: string): Promise<UserAccountType | null> {
        const result = await usersCollection.findOneAndUpdate({id: id}, {$set: {'emailConfirmation.confirmationCode': code}}, {returnDocument: "after"});
        if (!result.value || !result.ok) return null;
        return this._mapUserAccountDBTypeToUserAccountType(result.value);
    },
    _mapUserAccountDBTypeToUserAccountType(dbUser: UserAccountDbType): UserAccountType {
        return {
            id: dbUser.id,
            accountData: {...dbUser.accountData},
            emailConfirmation: {...dbUser.emailConfirmation}
        }
    }
}