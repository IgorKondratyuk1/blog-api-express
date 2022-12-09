import { v4 as uuidv4 } from 'uuid';
import {usersActionsRepository} from "../repositories/userActions/usersActionsRepository";
import {CreateUserActionsDbType} from "../repositories/userActions/userActionSchema";

export const UserActionsService = {
    async createAndGetCount(ip: string, resource: string): Promise<number | null> {
        const newUserAction: CreateUserActionsDbType = {
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
        return await usersActionsRepository.getUserActionsCount(ip, resource);
    }
}