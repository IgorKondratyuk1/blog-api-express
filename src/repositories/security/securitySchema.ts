import {WithId} from "mongodb";
import mongoose from "mongoose";
import {SETTINGS} from "../../config";

export type DeviceType = {
    ip: string
    title: string
    issuedAt: string
    expiredAt: string
    deviceId: string
    userId: string
    isValid: boolean
}

export type CreateDeviceDBType = {
    id: string
    ip: string
    title: string
    issuedAt: string
    expiredAt: string
    deviceId: string
    userId: string
    isValid: boolean
}

export type DeviceDBType = WithId<{
    id: string
    ip: string
    title: string
    issuedAt: string
    expiredAt: string
    deviceId: string
    userId: string
    isValid: boolean
}>

export const deviceSchema = new mongoose.Schema<DeviceDBType>({
    id: { type: String, required: true },
    title: { type: String },
    deviceId: { type: String },
    userId: { type: String, required: true },
    ip: { type: String },
    isValid: { type: Boolean },
    issuedAt: { type: String, required: true },
    expiredAt: { type: String, required: true }
},{optimisticConcurrency: true});

export const DeviceModel = mongoose.model('Device', deviceSchema);