import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../index";

export const authenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authData = "admin:qwerty";
    const serverSecret = Buffer.from(authData).toString('base64'); // login:password converted into base64

    const clientAuthHeader = req.header("authorization"); // all data form request 'Authorization' header. Example: "Base RdsfqtRqvE"
    const authType = clientAuthHeader?.split(" ")[0];
    const clientAuthSecret = clientAuthHeader?.split(" ")[1]; // get login and password from 'Authorization' header

    if (!clientAuthHeader) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }

    if (authType === "Basic" && serverSecret === clientAuthSecret) {
        next();
    } else {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }
}