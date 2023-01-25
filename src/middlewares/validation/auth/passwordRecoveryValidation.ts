import {body} from "express-validator";
import {inputValidationMiddleware} from "../../inputValidationMiddleware";

export const passwordRecoveryValidation = [
    body("email")
        .exists({checkFalsy: true}).withMessage("Field 'email' is not exist")
        .isString().withMessage("Field 'email' is not string")
        .notEmpty({ignore_whitespace: true}).withMessage("Field 'email' is empty")
        .isLength({min: 3, max: 200}).withMessage("Min length 3 and max length 200 symbols")
        .trim()
        .isEmail(),
    inputValidationMiddleware
];