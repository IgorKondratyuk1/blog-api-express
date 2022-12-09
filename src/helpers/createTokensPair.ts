import {SETTINGS} from "../config";
import {TokensPair} from "../types/types";
import {jwtService} from "../application/jwtService";
import {DeviceType} from "../repositories/security/securitySchema";

export const createTokensPair = async (deviceSession: DeviceType): Promise<TokensPair> => {
    const accessToken: string = await jwtService.createJWT({userId: deviceSession.userId, deviceId: deviceSession.deviceId, issuedAt: deviceSession.issuedAt}, SETTINGS.JWT_SECRET, Number(SETTINGS.ACCESS_TOKEN_EXPIRATION));
    const refreshToken: string = await jwtService.createJWT({userId: deviceSession.userId, deviceId: deviceSession.deviceId, issuedAt: deviceSession.issuedAt}, SETTINGS.JWT_SECRET, Number(SETTINGS.REFRESH_TOKEN_EXPIRATION));

    return {
        accessToken,
        refreshToken
    }
}