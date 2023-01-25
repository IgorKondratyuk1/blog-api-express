import mongoose, {Model} from "mongoose";
import {HydrateUserAction, UserActionsDbType} from "./userActionTypes";
import {v4 as uuidv4} from "uuid";
import {DeleteResult} from "mongodb";
import {SETTINGS} from "../../config";

type UserActionModel = Model<UserActionsDbType> & {
    createInstance(ip: string, resource: string): Promise<HydrateUserAction>
    getUserActionsCount(ip: string, resource: string): Promise<number>
    deleteExpiredActions(): Promise<DeleteResult | null>
}

export const userActionSchema = new mongoose.Schema<UserActionsDbType, UserActionModel, {}>({
    id: { type: String, required: true },
    ip: { type: String },
    resource: { type: String },
    lastActiveDate: { type: Date }
},{optimisticConcurrency: true});

userActionSchema.static("createInstance", async function createInstance(ip: string, resource: string) {
    const newUserAction = new UserAction({
        id: uuidv4(),
        lastActiveDate: new Date(),
        ip,
        resource
    });

    return this.create(newUserAction);
});

userActionSchema.static("getUserActionsCount", async function getUserActionsCount(ip: string, resource: string) {
    const count = await this.countDocuments({ip, resource});
    return count;
});

// userActionSchema.static("deleteExpiredActions", async function deleteExpiredActions() {
//     try {
//         const deleteDate: Date = (new Date(Date.now() - (SETTINGS.DEBOUNCE_TIME * 100)));
//         return UserAction.deleteMany({lastActiveDate: {$lte: deleteDate}});
//     } catch (error) {
//         console.log("Error in deleteExpiredActions");
//         console.log(error);
//         return null;
//     }
// });

export const UserAction = mongoose.model<UserActionsDbType, UserActionModel>('UserAction', userActionSchema);