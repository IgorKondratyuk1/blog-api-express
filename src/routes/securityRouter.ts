import {Request, Response, Router} from "express";
import {SecurityError, SecurityService} from "../domain/securityService";
import {DeviceViewModel} from "../models/auth/device/deviceViewModel";
import {HTTP_STATUSES} from "../index";
import {RequestWithParams} from "../types/types";
import {UriParamsDeviceModel} from "../models/auth/device/uriParamsDeviceModel";
import {checkRefreshTokenMiddleware} from "../middlewares/auth/checkRefreshTokenMiddleware";

export const securityRouter = Router({});

class SecurityController {
    private securityService: SecurityService;
    
    constructor() {
        this.securityService = new SecurityService();
        
    }
    
    async getSessions(req: Request, res: Response) {
        const devices: DeviceViewModel[] | null = await this.securityService.getAllDevices(req.user!.id);
        res.json(devices);
    }

    async deleteAllSessions(req: Request, res: Response) {
        const result: boolean = await this.securityService.deleteOtherSessions(req.user!.id, req!.deviceId);

        if (result) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        } else {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        }
    }

    async deleteSession(req: RequestWithParams<UriParamsDeviceModel>, res: Response) {
        const result: SecurityError = await this.securityService.deleteDeviceSession(req.user!.id, req.params.id);

        // const mappedResult = errorHandler(result)
        // res.status(mappedResult.statusCode).json(mappedResult.message)

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

const securityController = new SecurityController();

securityRouter.get("/",
    checkRefreshTokenMiddleware,
    securityController.getSessions.bind(securityController)
);

securityRouter.delete("/",
    checkRefreshTokenMiddleware,
    securityController.deleteAllSessions.bind(securityController)
);

securityRouter.delete("/:id",
    checkRefreshTokenMiddleware,
    securityController.deleteSession.bind(securityController)
);

// const errorHandler = (result: SecurityError): {statusCode: number, message: string} => {
//     switch (result) {
//         case SecurityError.Success:
//             return {statusCode: HTTP_STATUSES.OK_200, message: 'ok'}
//         case SecurityError.NotFoundError:
//             res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
//             return;
//         case SecurityError.WrongUserError:
//             res.sendStatus(HTTP_STATUSES.FORBIDDEN_403);
//             return;
//         default:
//             res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
//             return;
//     }
// }

