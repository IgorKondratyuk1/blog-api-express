import {userActionsCollection} from "../db";
import {UserActionsDbType, UserActionsType} from "../../types/userActionTypes";
import {mapUserActionsDbTypeToUserActionsType} from "../../helpers/mappers";
import {SETTINGS} from "../../config";
import {DeleteResult} from "mongodb";

export const usersActionsRepository = {
    async createUserAction(action: UserActionsDbType): Promise<UserActionsType> {
        const result = await userActionsCollection.insertOne(action);
        return mapUserActionsDbTypeToUserActionsType(action);
    },
    async getUserActionsCount(ip: string, resource: string): Promise<number> {
        return await userActionsCollection.countDocuments({ip, resource});
    },
    async deleteExpiredActions(): Promise<DeleteResult> {
        const deleteDate: Date = (new Date(Date.now() - (SETTINGS.DEBOUNCE_TIME * 100)));
        return userActionsCollection.deleteMany({lastActiveDate: {$lte: deleteDate}});
    },
    async deleteAllActions() {
        return userActionsCollection.deleteMany({});
    }
}