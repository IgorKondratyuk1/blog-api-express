import mongoose, {Model} from "mongoose";
import {add} from "date-fns";
import {SETTINGS} from "../../config";
import {v4 as uuidv4} from "uuid";
import {DeviceDbMethodsType, DeviceDbType, HydratedDevice} from "./securityTypes";

type DeviceModel = Model<DeviceDbType, {}, DeviceDbMethodsType> & {
    createInstance(userId: string, ip: string, title: string): Promise<HydratedDevice>
}

export const deviceSchema = new mongoose.Schema<DeviceDbType, DeviceModel, DeviceDbMethodsType>({
    id: { type: String, required: true },
    title: { type: String },
    deviceId: { type: String },
    userId: { type: String, required: true },
    ip: { type: String },
    isValid: { type: Boolean },
    issuedAt: { type: String, required: true },
    expiredAt: { type: String, required: true }
},{optimisticConcurrency: true});

deviceSchema.method('setIssuedDate', function setIssuedDate(issuedAt: string) {
    const device = this as DeviceDbType & DeviceDbMethodsType;
    device.issuedAt = issuedAt;
})

deviceSchema.static('createInstance', async function createInstance(userId: string, ip: string, title: string) {
    const expiredAt = add(new Date,{days: SETTINGS.EXPIRED_DEVICE_SESSION_DAYS}).toISOString();
    const issuedAt = (new Date()).toISOString();
    const newDeviceSession = new Device({
        id: uuidv4(),
            ip,
            deviceId: uuidv4(),
            expiredAt,
            title,
            userId,
            issuedAt,
            isValid: true
    });

    return this.create(newDeviceSession);
});

export const Device = mongoose.model<DeviceDbType, DeviceModel>('Device', deviceSchema);