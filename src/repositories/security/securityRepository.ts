import {DeviceDBType, DeviceType} from "../../types/deviceTypes";
import {securityCollection} from "../db";
import {mapDeviceDBTypeToDeviceType} from "../../helpers/mappers";

export const securityRepository = {
    async findUserDeviceSessions(userId: string): Promise<DeviceType[] | null> {
        const result: DeviceDBType[] | null = await securityCollection.find({userId: userId}).toArray();
        if (!result) return null;
        return result.map(mapDeviceDBTypeToDeviceType);
    },
    async findDeviceSession(deviceId: string): Promise<DeviceType | null> {
        const result: DeviceDBType | null = await securityCollection.findOne({deviceId: deviceId});
        if (!result) return null;
        return mapDeviceDBTypeToDeviceType(result);
    },
    async createDeviceSession(newDevice: DeviceDBType): Promise<DeviceType> {
        const result = await securityCollection.insertOne(newDevice);
        return mapDeviceDBTypeToDeviceType(newDevice);
    },
    async updateDeviceSessionIssuedDate(deviceId: string, issuedAt: string): Promise<boolean> {
        const result = await securityCollection.updateOne({deviceId: deviceId}, {issuedAt});
        return result.modifiedCount === 1;
    },
    async deleteOtherSessions(userId: string, currentDeviceId: string): Promise<boolean> {
        const result = await securityCollection.deleteMany({userId, deviceId: {$ne: currentDeviceId}});
        return result.deletedCount > 0;
    },
    async deleteDeviceSession(deviceId: string): Promise<boolean> {
        const result = await securityCollection.deleteOne({deviceId});
        return result.deletedCount === 1;
    },
    async deleteAllDevices() {
        return securityCollection.deleteMany({});
    }
}