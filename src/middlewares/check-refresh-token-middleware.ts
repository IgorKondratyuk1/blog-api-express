import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../index";
import {jwtService} from "../application/jwt-service";
import {authService} from "../domain/auth-service";
import {usersService} from "../domain/users-service";

export const checkRefreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const clientCookies = req.cookies;
    const refreshToken = clientCookies?.refreshToken;

    console.log('\n\nrefreshTokenMiddleware');
    console.log(clientCookies);
    console.log(refreshToken);


    if (!refreshToken) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }

    const refreshTokenData = await jwtService.getDataByToken(refreshToken);
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

    if (refreshTokenData?.exp && new Date(1000 * refreshTokenData.exp) < new Date()) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }

    // Check that token in black list
    const isInBlackList = await authService.checkRefreshToken(refreshToken);
    console.log("token: " + isInBlackList);
    if (isInBlackList) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }

    if (refreshTokenData.userId) {
        const foundedUser = await usersService.findUserById(refreshTokenData.userId);
        if (!foundedUser) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            return;
        }

        req.user = foundedUser;
        next();
    } else {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    }
}