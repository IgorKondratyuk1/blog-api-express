import {injectable} from "inversify";
import {UserAction} from "../../domain/UserAction/userActionSchema";
import {DeleteResult} from "mongodb";
import {SETTINGS} from "../../config";

@injectable()
export class UsersActionsRepository {
    async deleteAllActions() {
        try {
            return UserAction.deleteMany({});
        } catch (error) {
            console.log(error);
        }
    }
    async deleteExpiredActions(): Promise<DeleteResult | null> {
        try {
            const deleteDate: Date = (new Date(Date.now() - (SETTINGS.DEBOUNCE_TIME * 100)));
            return UserAction.deleteMany({lastActiveDate: {$lte: deleteDate}});
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}