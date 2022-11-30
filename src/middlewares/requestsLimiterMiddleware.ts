import {NextFunction, Request, Response} from "express";
import {UserActionsService} from "../domain/userActions";
import {HTTP_STATUSES} from "../index";

export const requestsLimiterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const count: number = await UserActionsService.createAndGetCount(req.ip, req.path);
    if (count >= 5) {
        res.sendStatus(HTTP_STATUSES.TOO_MANY_REQUESTS_429);
        return;
    }
    next();
}