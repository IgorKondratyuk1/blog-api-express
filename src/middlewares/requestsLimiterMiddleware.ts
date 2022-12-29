import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../index";
import {UserActionsService} from "../domain/userActions";
import {userActionsService} from "../compositionRoot";

export const requestsLimiterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const resource = `${req.method}:${req.path}`;
    const count: number | null = await userActionsService.createAndGetCount(req.ip, resource);

    if (count === null) { res.sendStatus(HTTP_STATUSES.TOO_MANY_REQUESTS_429); return; }
    if (count > 5) { res.sendStatus(HTTP_STATUSES.TOO_MANY_REQUESTS_429); return;}

    next();
}