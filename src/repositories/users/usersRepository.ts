import {usersCollection} from "../db";
import {PasswordRecoveryType, UserAccountDbType, UserAccountType} from "../../types/userTypes";
import {mapUserAccountDBTypeToUserAccountType} from "../../helpers/mappers";

export const usersRepository = {
    async findUserById(id: string): Promise<UserAccountType | null> {
        const dbUser: UserAccountDbType | null = await usersCollection.findOne({id: id});
        if (!dbUser) return null;
        return mapUserAccountDBTypeToUserAccountType(dbUser);
    },
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserAccountType | null> {
        const dbUser: UserAccountDbType | null = await usersCollection.findOne({$or: [{'accountData.login': loginOrEmail}, {'accountData.email': loginOrEmail}]});
        if (!dbUser) return null
        return mapUserAccountDBTypeToUserAccountType(dbUser);
    },
    async findUserByEmailConfirmationCode(code: string) {
        const dbUser: UserAccountDbType | null = await usersCollection.findOne({'emailConfirmation.confirmationCode': code});
        if (!dbUser) return null;
        return mapUserAccountDBTypeToUserAccountType(dbUser);
    },
    async findUserByPasswordConfirmationCode(code: string) {
        const dbUser: UserAccountDbType | null = await usersCollection.findOne({'passwordRecovery.recoveryCode': code});
        if (!dbUser) return null;
        return mapUserAccountDBTypeToUserAccountType(dbUser);
    },
    async createUser(newUser: UserAccountDbType): Promise<UserAccountType | null> {
        const result = await usersCollection.insertOne(newUser);
        if (!result.insertedId) return null;
        return mapUserAccountDBTypeToUserAccountType(newUser);
    },
    async updatePasswordRecoveryCode(id: string, recoveryData: PasswordRecoveryType): Promise<UserAccountType | null> {
        const result = await usersCollection.findOneAndUpdate({id}, {$set:{passwordRecovery: recoveryData}}, {returnDocument: "after"});
        if (!result.value || !result.ok) return null;
        return mapUserAccountDBTypeToUserAccountType(result.value);
    },
    async updateUserConfirmCode(id: string, code: string): Promise<UserAccountType | null> {
        const result = await usersCollection.findOneAndUpdate({id}, {$set: {'emailConfirmation.confirmationCode': code}}, {returnDocument: "after"});
        if (!result.value || !result.ok) return null;
        return mapUserAccountDBTypeToUserAccountType(result.value);
    },
    async updateUserPassword(id: string, newPasswordHash: string): Promise<boolean> {
        const result = await usersCollection.updateOne({id}, {$set:{'accountData.passwordHash': newPasswordHash}});
        return result.modifiedCount === 1;
    },
    async confirmUserEmail(id: string) {
        const result = await usersCollection.updateOne({id}, {$set: { 'emailConfirmation.isConfirmed': true}});
        return result.modifiedCount === 1;
    },
    async deleteUser(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id: id});
        return result.deletedCount === 1;
    },
    async deleteAllUsers() {
        return usersCollection.deleteMany({});
    }
}