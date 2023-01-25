import {SecurityRepository} from "../repositories/security/securityRepository";
import {inject, injectable} from "inversify";
import {Device} from "../01_domain/Security/securitySchema";
import {DeviceViewModel} from "../models/auth/device/deviceViewModel";
import {mapDeviceDBTypeToDeviceViewModel} from "../helpers/mappers";
import {DeviceType, HydratedDevice} from "../01_domain/Security/securityTypes";

export enum SecurityError {
    Success,
    WrongUserError,
    NotFoundError
}

@injectable()
export class SecurityService {
    constructor(
        @inject(SecurityRepository) protected securityRepository: SecurityRepository
    ) {}
    async findDeviceSession(deviceId: string): Promise<HydratedDevice | null> {
        const device: HydratedDevice | null | undefined = await this.securityRepository.findDeviceSession(deviceId);
        if (!device) return null
        return device;
    }
    // TODO maybe change to HydrateDevice[]
    async getAllDevices(userId: string): Promise<DeviceViewModel[] | null> {
        const result: DeviceType[] | null = await this.securityRepository.findUserDeviceSessions(userId);
        if (!result) return null;
        return result.map(mapDeviceDBTypeToDeviceViewModel);
    }
    async createDeviceSession(userId: string, ip: string, title: string): Promise<HydratedDevice> {
        const newDeviceSession: HydratedDevice = await Device.createInstance(userId, ip, title);
        return newDeviceSession;
    }
    async deleteOtherSessions(userId: string, currentSessionId: string): Promise<boolean> {
        return await this.securityRepository.deleteOtherSessions(userId, currentSessionId);
    }
    async deleteDeviceSession(currentUserId: string, deviceId: string): Promise<SecurityError> {
        const deviceSession = await this.securityRepository.findDeviceSession(deviceId);

        if (!deviceSession) return SecurityError.NotFoundError;
        if (currentUserId !== deviceSession.userId) return SecurityError.WrongUserError;

        const deleteSession = await this.securityRepository.deleteDeviceSession(deviceId);
        return deleteSession ? SecurityError.Success : SecurityError.NotFoundError;
    }
}