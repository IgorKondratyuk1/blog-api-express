import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../index";
import {APIErrorResult} from "../types/types";

export const errorsHandlingMiddleware = (error: unknown, req: Request, res: Response<APIErrorResult>, next: NextFunction) => {
    let fieldName: string = ""; // field in which is error occurred
    let message: string = ""; // error massage

    if (typeof error === "string") {
        message = error.toUpperCase();
    } else if (error instanceof Error) {

        if (error.message.includes("#")) {
            fieldName = error.message.split("#")[0];
            message = error.message.split("#")[1];
        } else {
            message = error.message;
        }

    } else if (typeof error === "undefined") {
        message = "Some error occurred";
    }

    res.status(HTTP_STATUSES.BAD_REQUEST_400)
        .json({
            errorsMessages: [
                {
                    message: message,
                    field: fieldName
                }
            ]
        });
}