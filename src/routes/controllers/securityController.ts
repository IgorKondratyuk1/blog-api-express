import {SecurityError, SecurityService} from "../../application/securityService";
import {Request, Response} from "express";
import {DeviceViewModel} from "../../models/auth/device/deviceViewModel";
import {HTTP_STATUSES} from "../../index";
import {RequestWithParams} from "../../types/types";
import {UriParamsDeviceModel} from "../../models/auth/device/uriParamsDeviceModel";
import {inject, injectable} from "inversify";

@injectable()
export class SecurityController {
    constructor(
        @inject(SecurityService) protected securityService: SecurityService) {
    }

    async getSessions(req: Request, res: Response) {
        const devices: DeviceViewModel[] | null = await this.securityService.getAllDevices(req.userId);
        res.json(devices);
    }

    async deleteAllSessions(req: Request, res: Response) {
        const result: boolean = await this.securityService.deleteOtherSessions(req.userId, req!.deviceId);

        if (result) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        } else {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        }
    }

    async deleteSession(req: RequestWithParams<UriParamsDeviceModel>, res: Response) {
        if (!req.userId) { res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401); return; }
        const result: SecurityError = await this.securityService.deleteDeviceSession(req.userId, req.params.id);

        switch (result) {
            case SecurityError.Success:
                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
                return;
            case SecurityError.NotFoundError:
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
                return;
            case SecurityError.WrongUserError:
                res.sendStatus(HTTP_STATUSES.FORBIDDEN_403);
                return;
            default:
                res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
                return;
        }
    }
}