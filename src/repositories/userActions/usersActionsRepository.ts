import {mapUserActionsDbTypeToUserActionsType} from "../../helpers/mappers";
import {SETTINGS} from "../../config";
import {DeleteResult} from "mongodb";
import {CreateUserActionsDbType, UserActionModel, UserActionsDbType, UserActionsType} from "./userActionSchema";

export class UsersActionsRepository {
    async createUserAction(newAction: CreateUserActionsDbType): Promise<UserActionsType | null> {
        try {
            const action = new UserActionModel(newAction);
            const createdAction: UserActionsDbType = await action.save();
            return mapUserActionsDbTypeToUserActionsType(createdAction);
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async getUserActionsCount(ip: string, resource: string): Promise<number | null> {
        try {
            return await UserActionModel.countDocuments({ip, resource});
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async deleteExpiredActions(): Promise<DeleteResult | null> {
        try {
            const deleteDate: Date = (new Date(Date.now() - (SETTINGS.DEBOUNCE_TIME * 100)));
            return UserActionModel.deleteMany({lastActiveDate: {$lte: deleteDate}});
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async deleteAllActions() {
        try {
            return UserActionModel.deleteMany({});
        } catch (error) {
            console.log(error);
        }
    }
}