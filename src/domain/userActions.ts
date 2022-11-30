import { v4 as uuidv4 } from 'uuid';
import {usersActionsRepository} from "../repositories/userActions/usersActionsRepository";
import {UserActionsDbType, UserActionsType} from "../types/userActionTypes";

export const UserActionsService = {
    async createAndGetCount(ip: string, resource: string): Promise<number> {
        const newUserAction: UserActionsDbType = {
            id: uuidv4(),
            lastActiveDate: new Date(),
            ip,
            resource
        };
        // Add new action to db
        await usersActionsRepository.createUserAction(newUserAction);

        // Delete expired actions
        await usersActionsRepository.deleteExpiredActions();

        // Get actions count of current user(ip)
        const actionsCount: number = await usersActionsRepository.getUserActionsCount(ip, resource);
        return actionsCount;
    }
}