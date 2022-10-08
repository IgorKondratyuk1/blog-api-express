import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../index";
import {APIErrorResult} from "../types/types";


export const errorsHandlingMiddleware = (error: unknown, req: Request, res: Response<APIErrorResult>, next: NextFunction) => {
    let fieldName: string = ""; // field in which is error occurred
    let message: string = ""; // error massage

    if (typeof error === "string") {
        message = error.toUpperCase();
    } else if (error instanceof Error) {
        message = error.message;
    } else if (typeof error === "undefined") {
        message = "Some error occurred";
    }

    res.status(HTTP_STATUSES.NOT_FOUND_404)
        .json({
            errorsMessages: [
                {
                    message: message,
                    field: fieldName
                }
            ]
        });
}