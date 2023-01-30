import {DeleteResult} from "mongodb";
import {injectable} from "inversify";
import {User} from "../../domain/User/UserScheme";
import {HydratedUser} from "../../domain/User/UserTypes";

@injectable()
export class UsersRepository {
    async save(user: HydratedUser) {
        await user.save();
    }
    async findUserById(id: string): Promise<HydratedUser | null> {
        try{
            const user: HydratedUser | null = await User.findOne({id});
            return user;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<HydratedUser | null> {
        try{
            const user: HydratedUser | null = await User.findOne({$or: [{'accountData.login': loginOrEmail}, {'accountData.email': loginOrEmail}]});
            return user;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async findUserByEmailConfirmationCode(code: string): Promise<HydratedUser | null> {
        try {
            const user: HydratedUser | null = await User.findOne({'emailConfirmation.confirmationCode': code});
            return user;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async findUserByPasswordConfirmationCode(code: string): Promise<HydratedUser | null > {
        try {
            const user: HydratedUser | null  = await User.findOne({'passwordRecovery.recoveryCode': code});
            return user;
        }  catch (error) {
            console.log(error);
            return null;
        }
    }
    async deleteUser(id: string): Promise<boolean> {
        try {
            const result: DeleteResult = await User.deleteOne({id});
            return result.deletedCount === 1;
        }  catch (error) {
            console.log(error);
            return false;
        }
    }
    async deleteAllUsers() {
        return User.deleteMany({});
    }
}