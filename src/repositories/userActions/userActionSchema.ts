import {WithId} from "mongodb";
import mongoose from "mongoose";
import {SETTINGS} from "../../config";

export type UserActionsType = {
    ip: string
    resource: string
    lastActiveDate: Date
}

export type CreateUserActionsDbType = {
    id: string
    ip: string
    resource: string
    lastActiveDate: Date
}

export type UserActionsDbType = WithId<{
    id: string
    ip: string
    resource: string
    lastActiveDate: Date
}>

export const userActionSchema = new mongoose.Schema<UserActionsDbType>({
    id: { type: String, required: true },
    ip: { type: String },
    resource: { type: String },
    lastActiveDate: { type: Date }
},{optimisticConcurrency: true});

export const UserActionModel = mongoose.model('UserAction', userActionSchema);

