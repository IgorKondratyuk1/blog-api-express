import {Request, Response, Router} from "express";
import {securityError, securityService} from "../domain/securityService";
import {DeviceViewModel} from "../models/auth/device/deviceViewModel";
import {HTTP_STATUSES} from "../index";
import {RequestWithParams} from "../types/types";
import {UriParamsDeviceModel} from "../models/auth/device/uriParamsDeviceModel";
import {checkRefreshTokenMiddleware} from "../middlewares/checkRefreshTokenMiddleware";

export const securityRouter = Router({});

securityRouter.get("/",
    checkRefreshTokenMiddleware,
    async (req: Request, res: Response) => {
        const devices: DeviceViewModel[] | null = await securityService.getAllDevices(req.user!.id);
        res.json(devices);
});

securityRouter.delete("/",
    checkRefreshTokenMiddleware,
    async (req: Request, res: Response) => {
        const result: boolean = await securityService.deleteOtherSessions(req.user!.id, req!.deviceId);

        if (result) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        }
        else {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        }
});

securityRouter.delete("/:id",
    checkRefreshTokenMiddleware,
    async (req: RequestWithParams<UriParamsDeviceModel>, res: Response) => {
        const result: securityError = await securityService.deleteDeviceSession(req.user!.id, req.params.id);
        switch (result) {
            case securityError.Success:
                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
                return;
            case securityError.NotFoundError:
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
                return;
            case securityError.WrongUserError:
                res.sendStatus(HTTP_STATUSES.FORBIDDEN_403);
                return;
            default:
                res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
                return;
        }
});