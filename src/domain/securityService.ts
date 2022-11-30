import {securityRepository} from "../repositories/security/securityRepository";
import {DeviceDBType, DeviceType} from "../types/deviceTypes";
import {DeviceViewModel} from "../models/auth/device/deviceViewModel";
import { v4 as uuidv4 } from 'uuid';
import {add} from "date-fns";
import {securityCollection} from "../repositories/db";
import {mapDeviceDBTypeToDeviceViewModel} from "../helpers/mappers";

export enum securityError {
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
        const result: DeviceDBType | null = await securityCollection.findOne({deviceId: deviceId});
        return result;
    },
    async createDeviceSession(userId: string, ip: string, title: string): Promise<DeviceType | null> {
        const expiredAt = add(new Date,{days: 1}).toISOString();
        const issuedAt = (new Date()).toISOString();

        const newDeviceSession: DeviceDBType = {
            id: uuidv4(),
            ip,
            deviceId: uuidv4(),
            expiredAt,
            title,
            userId,
            issuedAt,
            isValid: true,
        }

        const createdSession: DeviceType = await securityRepository.createDeviceSession(newDeviceSession);
        if (!createdSession) return null;
        return createdSession;
    },
    async deleteOtherSessions(userId: string, currentSessionId: string): Promise<boolean> {
        return await securityRepository.deleteOtherSessions(userId, currentSessionId);
    },
    async deleteDeviceSession(currentUserId: string, deviceId: string): Promise<securityError> {
        const deviceSession = await securityRepository.findDeviceSession(deviceId);

        if (!deviceSession) return securityError.NotFoundError;
        if (currentUserId !== deviceSession.userId) return securityError.WrongUserError;

        const deleteSession = await securityRepository.deleteDeviceSession(deviceId);
        return deleteSession ? securityError.Success : securityError.NotFoundError;
    }
}