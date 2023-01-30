import {mapDeviceDBTypeToDeviceType} from "../../helpers/mappers";
import {DeleteResult} from "mongodb";
import {injectable} from "inversify";
import {Device} from "../../domain/Security/securitySchema";
import {DeviceDbType, DeviceType, HydratedDevice} from "../../domain/Security/securityTypes";

@injectable()
export class SecurityRepository {
    async save(device: HydratedDevice) {
        await device.save();
    }
    async findUserDeviceSessions(userId: string): Promise<DeviceType[] | null> {
        try {
            const devices: DeviceDbType[] | null = await Device.find({userId}).lean();
            if (!devices) return null;
            return devices.map(mapDeviceDBTypeToDeviceType);
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async findDeviceSession(deviceId: string): Promise<HydratedDevice | null | undefined> {
        try {
            const device: HydratedDevice | null | undefined = await Device.findOne({deviceId});
            return device;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async deleteOtherSessions(userId: string, currentDeviceId: string): Promise<boolean> {
        try {
            const result: DeleteResult = await Device.deleteMany({userId, deviceId: {$ne: currentDeviceId}});
            return result.deletedCount > 0;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async deleteDeviceSession(deviceId: string): Promise<boolean> {
        try {
            const result: DeleteResult = await Device.deleteOne({deviceId});
            return result.deletedCount === 1;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async deleteAllSessions() {
        try {
            return await Device.deleteMany({});
        } catch (error) {
            console.log(error);
        }
    }
}