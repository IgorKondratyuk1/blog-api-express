import {SETTINGS} from "../config";
import {TokensPair} from "../types/types";
import {JWTService} from "../application/JWTService";
import {DeviceType} from "../domain/Security/securityTypes";

export const createTokensPair = async (deviceSession: DeviceType): Promise<TokensPair> => {
    const jwtServiceInstance = new JWTService();
    const accessToken: string = await jwtServiceInstance.createJWT({userId: deviceSession.userId, deviceId: deviceSession.deviceId, issuedAt: deviceSession.issuedAt}, SETTINGS.JWT_SECRET, Number(SETTINGS.ACCESS_TOKEN_EXPIRATION));
    const refreshToken: string = await jwtServiceInstance.createJWT({userId: deviceSession.userId, deviceId: deviceSession.deviceId, issuedAt: deviceSession.issuedAt}, SETTINGS.JWT_SECRET, Number(SETTINGS.REFRESH_TOKEN_EXPIRATION));

    return {
        accessToken,
        refreshToken
    }
}