import {mapDeviceDBTypeToDeviceType} from "../../helpers/mappers";
import {CreateDeviceDBType, DeviceDBType, DeviceModel, DeviceType} from "./securitySchema";
import {DeleteResult} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class SecurityRepository {
    async findUserDeviceSessions(userId: string): Promise<DeviceType[] | null> {
        try {
            const result: DeviceDBType[] | null = await DeviceModel.find({userId}).lean();
            if (!result) return null;
            return result.map(mapDeviceDBTypeToDeviceType);
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async findDeviceSession(deviceId: string): Promise<DeviceType | null> {
        try {
            const result: DeviceDBType | null = await DeviceModel.findOne({deviceId}).exec();
            if (!result) return null;
            return mapDeviceDBTypeToDeviceType(result);
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async createDeviceSession(newDevice: CreateDeviceDBType): Promise<DeviceType | null> {
        try{
            const deviceSession = new DeviceModel(newDevice);
            const createdSession = await deviceSession.save();
            return mapDeviceDBTypeToDeviceType(createdSession);
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async updateDeviceSessionIssuedDate(deviceId: string, issuedAt: string): Promise<boolean> {
        try {
            const deviceSession = await DeviceModel.findOne({deviceId});
            if (!deviceSession) return false;

            deviceSession.issuedAt = issuedAt;
            await deviceSession.save();
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async deleteOtherSessions(userId: string, currentDeviceId: string): Promise<boolean> {
        try {
            const result: DeleteResult = await DeviceModel.deleteMany({userId, deviceId: {$ne: currentDeviceId}});
            return result.deletedCount > 0;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async deleteDeviceSession(deviceId: string): Promise<boolean> {
        try {
            const result: DeleteResult = await DeviceModel.deleteOne({deviceId});
            return result.deletedCount === 1;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async deleteAllDevices() {
        try {
            return await DeviceModel.deleteMany({});
        } catch (error) {
            console.log(error);
        }
    }
}