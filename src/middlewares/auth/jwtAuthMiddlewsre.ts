import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../../index";
import {jwtService} from "../../application/jwtService";
import {UsersService} from "../../domain/usersService";
import {usersService} from "../../compositionRoot";

export const jwtAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const clientAuthHeader = req.header("authorization");
    const authType = clientAuthHeader?.split(" ")[0];
    const token = clientAuthHeader?.split(' ')[1];

    if (!clientAuthHeader || !token || authType?.toLowerCase() !== "bearer") {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }

    const userId = await jwtService.getUserIdByToken(token);

    if (userId) {
        const foundedUser = await usersService.findUserById(userId);

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