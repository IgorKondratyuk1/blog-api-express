import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

const formattedValidationResult = validationResult.withDefaults({
    formatter: error => {
        return {
            message: error.msg,
            field: error.param
        };
    },
});

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = formattedValidationResult(req);

    if (!errors.isEmpty()) {
        const errorsArr = errors.array({onlyFirstError: true});

        res.status(400).json({errorsMessages: errorsArr});
        return;
    } else {
        next();
    }
}