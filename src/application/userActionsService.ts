import {UsersActionsRepository} from "../repositories/userActions/usersActionsRepository";
import {inject, injectable} from "inversify";
import {UserAction} from "../domain/UserAction/userActionSchema";

@injectable()
export class UserActionsService {
    constructor(
        @inject(UsersActionsRepository) protected usersActionsRepository: UsersActionsRepository
    ) {}

    async createAndGetCount(ip: string, resource: string): Promise<number | null> {
        // Add new action to db
        await UserAction.createInstance(ip, resource);

        // Delete expired actions
        await this.usersActionsRepository.deleteExpiredActions();

        // Get actions count of current user(ip)
        return await UserAction.getUserActionsCount(ip, resource)
    }
}