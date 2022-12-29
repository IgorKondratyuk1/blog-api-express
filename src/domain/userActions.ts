import { v4 as uuidv4 } from 'uuid';
import {CreateUserActionsDbType} from "../repositories/userActions/userActionSchema";
import {UsersActionsRepository} from "../repositories/userActions/usersActionsRepository";

export class UserActionsService {
    constructor(protected usersActionsRepository: UsersActionsRepository) {}

    async createAndGetCount(ip: string, resource: string): Promise<number | null> {
        const newUserAction: CreateUserActionsDbType = {
            id: uuidv4(),
            lastActiveDate: new Date(),
            ip,
            resource
        };
        // Add new action to db
        await this.usersActionsRepository.createUserAction(newUserAction);

        // Delete expired actions
        await this.usersActionsRepository.deleteExpiredActions();

        // Get actions count of current user(ip)
        return await this.usersActionsRepository.getUserActionsCount(ip, resource);
    }
}