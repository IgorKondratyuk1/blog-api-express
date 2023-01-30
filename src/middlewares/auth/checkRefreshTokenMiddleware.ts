import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../../index";
import {SETTINGS} from "../../config";
import {JWTDataType, JWTService} from "../../application/JWTService";
import {container} from "../../compositionRoot";
import {SecurityService} from "../../application/securityService";
import {HydratedDevice} from "../../domain/Security/securityTypes";
import {UsersRepository} from "../../repositories/users/usersRepository";
import {HydratedUser} from "../../domain/User/UserTypes";
import {logData} from "../../helpers/tokenLogs";

const securityService = container.resolve(SecurityService);
const usersRepository = container.resolve(UsersRepository);
const jwtService = container.resolve(JWTService);



export const checkRefreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies?.refreshToken;

    // 1. Check that refreshToken exists
    if (!refreshToken) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }

    // 2. Get data from refresh token
    const refreshTokenData: JWTDataType = await jwtService.getDataByToken(refreshToken);

    // 2.1. Check that refreshTokenData is exists
    if (!refreshTokenData) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }

    // 2.2. Check that all data in token is exists
    const {userId, deviceId, issuedAt} = refreshTokenData;
    if (!userId || !deviceId || !issuedAt) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }

    logData(refreshTokenData);

    // 3. Get device session
    const deviceSession: HydratedDevice | null = await securityService.findDeviceSession(deviceId);
    if (!deviceSession) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }

    // 4. Check that token is valid
    if (deviceSession.issuedAt !== issuedAt) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }

    const foundedUser: HydratedUser | null = await usersRepository.findUserById(userId);
    if (!foundedUser) { res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401); return; }

    // 5. Set refresh token data
    req.userId = foundedUser.id;
    req.userLogin = foundedUser.accountData.login;
    req.deviceId = deviceId;
    req.issuedAt = issuedAt;

    next();
}