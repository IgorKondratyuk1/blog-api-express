import {mapUserAccountDBTypeToUserAccountType} from "../../helpers/mappers";
import {
    CreateUserAccountDbType,
    PasswordRecoveryType,
    UserAccountDbType,
    UserAccountType,
    UserModel
} from "./userSchema";
import {DeleteResult} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class UsersRepository {
    async findUserById(id: string): Promise<UserAccountType | null> {
        try{
            const dbUser: UserAccountDbType | null = await UserModel.findOne({id});
            if (!dbUser) return null;
            return mapUserAccountDBTypeToUserAccountType(dbUser);
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserAccountType | null> {
        try{
            const dbUser: UserAccountDbType | null = await UserModel.findOne({$or: [{'accountData.login': loginOrEmail}, {'accountData.email': loginOrEmail}]}).exec();

            if (!dbUser) return null
            return mapUserAccountDBTypeToUserAccountType(dbUser);
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async findUserByEmailConfirmationCode(code: string) {
        try {
            const dbUser: UserAccountDbType | null = await UserModel.findOne({'emailConfirmation.confirmationCode': code});
            if (!dbUser) return null;
            return mapUserAccountDBTypeToUserAccountType(dbUser);
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async findUserByPasswordConfirmationCode(code: string): Promise<UserAccountType | null> {
        try {
            const dbUser: UserAccountDbType | null = await UserModel.findOne({'passwordRecovery.recoveryCode': code});
            if (!dbUser) return null;
            return mapUserAccountDBTypeToUserAccountType(dbUser);
        }  catch (error) {
            console.log(error);
            return null;
        }
    }
    async createUser(newUser: CreateUserAccountDbType): Promise<UserAccountType | null> {
        try {
            const user = new UserModel(newUser);
            const createdUser: UserAccountDbType = await user.save();
            return mapUserAccountDBTypeToUserAccountType(createdUser);
        }  catch (error) {
            console.log(error);
            return null;
        }
    }
    async updatePasswordRecoveryCode(id: string, recoveryData: PasswordRecoveryType): Promise<UserAccountType | null> {
        try {
            const result = await UserModel.findOneAndUpdate({id}, {$set:{passwordRecovery: recoveryData}}, {returnDocument: "after"});
            if (!result) return null;
            return mapUserAccountDBTypeToUserAccountType(result);
        }  catch (error) {
            console.log(error);
            return null;
        }
    }
    async updateUserConfirmCode(id: string, code: string): Promise<UserAccountType | null> {
        try {
            const result = await UserModel.findOneAndUpdate({id}, {$set: {'emailConfirmation.confirmationCode': code}}, {returnDocument: "after"});
            if (!result) return null;
            return mapUserAccountDBTypeToUserAccountType(result);
        }  catch (error) {
            console.log(error);
            return null;
        }
    }
    async updateUserPassword(id: string, newPasswordHash: string): Promise<boolean> {
        try {
            const user = await UserModel.findOne({id});
            if(!user) return false;

            user.accountData.passwordHash = newPasswordHash;
            await user.save();
            return true;
        }  catch (error) {
            console.log(error);
            return false;
        }
    }
    async confirmUserEmail(id: string): Promise<boolean> {
        try {
            const user = await UserModel.findOne({id});
            if(!user) return false;

            user.emailConfirmation.isConfirmed = true;
            await user.save();
            return true;
        }  catch (error) {
            console.log(error);
            return false;
        }
    }
    async deleteUser(id: string): Promise<boolean> {
        try {
            const result: DeleteResult = await UserModel.deleteOne({id});
            return result.deletedCount === 1;
        }  catch (error) {
            console.log(error);
            return false;
        }
    }
    async deleteAllUsers() {
        return UserModel.deleteMany({});
    }
}