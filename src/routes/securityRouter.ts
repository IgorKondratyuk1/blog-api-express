import {Router} from "express";
import {checkRefreshTokenMiddleware} from "../middlewares/auth/checkRefreshTokenMiddleware";
import {container} from "../compositionRoot";
import {SecurityController} from "./controllers/securityController";

const securityController = container.resolve(SecurityController);

export const securityRouter = Router({});

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

