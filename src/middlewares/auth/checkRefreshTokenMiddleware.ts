import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../../index";
import {SETTINGS} from "../../config";
import {JWTDataType, jwtService} from "../../02_application/jwtService";
import {container} from "../../compositionRoot";
import {SecurityService} from "../../02_application/securityService";
import {HydratedDevice} from "../../01_domain/Security/securityTypes";
import {UsersRepository} from "../../repositories/users/usersRepository";
import {HydratedUser} from "../../01_domain/User/UserTypes";


const securityService = container.resolve(SecurityService);
const usersRepository = container.resolve(UsersRepository);

const logData = (refreshTokenData: any) => {
    if(SETTINGS.EXTENDED_LOGS){
        console.log('\n>>>\tRefresh Token Middleware');
        try {
            console.log(refreshTokenData);
            console.log("iat: " + new Date(1000 * refreshTokenData.iat));
            console.log("exp " + new Date(1000 * refreshTokenData.exp));
            console.log("now " + new Date());
            console.log(new Date(1000 * refreshTokenData.exp) < new Date());
        } catch (err) {
            console.log('Error catch');
            console.log(err);
        }
        console.log('>>>\tEnd\n');
    }
}

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
    // Check that refresh token is not expired (deprecated - if token expired validation function will return NULL)
    // if (refreshTokenData?.exp && new Date(1000 * refreshTokenData.exp) < new Date()) {
    //     res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    //     return;
    // }

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