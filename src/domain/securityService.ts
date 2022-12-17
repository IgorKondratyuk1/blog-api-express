import {DeviceViewModel} from "../models/auth/device/deviceViewModel";
import { v4 as uuidv4 } from 'uuid';
import {add} from "date-fns";
import {mapDeviceDBTypeToDeviceViewModel} from "../helpers/mappers";
import {CreateDeviceDBType, DeviceType} from "../repositories/security/securitySchema";
import {SETTINGS} from "../config";
import {SecurityRepository} from "../repositories/security/securityRepository";

export enum SecurityError {
    Success,
    WrongUserError,
    NotFoundError
}

// type Result<T> = {
//     status: SecurityError,
//     data: T | null
// }

export class SecurityService {
    private securityRepository: SecurityRepository

    constructor() {
        this.securityRepository = new SecurityRepository();
    }

    async getAllDevices(userId: string): Promise<DeviceViewModel[] | null> {
        const result: DeviceType[] | null = await this.securityRepository.findUserDeviceSessions(userId);
        if (!result) return null;
        return result.map(mapDeviceDBTypeToDeviceViewModel);
    }
    async findDeviceSession(deviceId: string): Promise<DeviceType | null> {
        const result: DeviceType | null = await this.securityRepository.findDeviceSession(deviceId);
        return result;
    }
    async createDeviceSession(userId: string, ip: string, title: string): Promise<DeviceType | null> {
        const expiredAt = add(new Date,{days: SETTINGS.EXPIRED_DEVICE_SESSION_DAYS}).toISOString();
        const issuedAt = (new Date()).toISOString();

        const newDeviceSession: CreateDeviceDBType = {
            id: uuidv4(),
            ip,
            deviceId: uuidv4(),
            expiredAt,
            title,
            userId,
            issuedAt,
            isValid: true
        }

        return this.securityRepository.createDeviceSession(newDeviceSession);
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