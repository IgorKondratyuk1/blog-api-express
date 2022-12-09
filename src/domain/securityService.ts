import {securityRepository} from "../repositories/security/securityRepository";
import {DeviceViewModel} from "../models/auth/device/deviceViewModel";
import { v4 as uuidv4 } from 'uuid';
import {add} from "date-fns";
import {mapDeviceDBTypeToDeviceViewModel} from "../helpers/mappers";
import {CreateDeviceDBType, DeviceDBType, DeviceType} from "../repositories/security/securitySchema";

export enum SecurityError {
    Success,
    WrongUserError,
    NotFoundError
}

export const securityService = {
    async getAllDevices(userId: string): Promise<DeviceViewModel[] | null> {
        const result: DeviceType[] | null = await securityRepository.findUserDeviceSessions(userId);
        if (!result) return null;
        return result.map(mapDeviceDBTypeToDeviceViewModel);
    },
    async findDeviceSession(deviceId: string): Promise<DeviceType | null> {
        const result: DeviceType | null = await securityRepository.findDeviceSession(deviceId);
        return result;
    },
    async createDeviceSession(userId: string, ip: string, title: string): Promise<DeviceType | null> {
        const expiredAt = add(new Date,{days: 1}).toISOString();
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

        return securityRepository.createDeviceSession(newDeviceSession);
    },
    async deleteOtherSessions(userId: string, currentSessionId: string): Promise<boolean> {
        return await securityRepository.deleteOtherSessions(userId, currentSessionId);
    },
    async deleteDeviceSession(currentUserId: string, deviceId: string): Promise<SecurityError> {
        const deviceSession = await securityRepository.findDeviceSession(deviceId);

        if (!deviceSession) return SecurityError.NotFoundError;
        if (currentUserId !== deviceSession.userId) return SecurityError.WrongUserError;

        const deleteSession = await securityRepository.deleteDeviceSession(deviceId);
        return deleteSession ? SecurityError.Success : SecurityError.NotFoundError;
    }
}