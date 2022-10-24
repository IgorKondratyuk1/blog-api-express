import {body} from "express-validator";
import {inputValidationMiddleware} from "../../middlewares/input-validation-middleware";

export const registrationConfirmationValidationSchema = [
    body("code")
        .exists({checkFalsy: true}).withMessage("Field 'code' is not exist")
        .isString().withMessage("Field 'code' is not string")
        .notEmpty({ignore_whitespace: true}).withMessage("Field 'code' is empty")
        .trim()
        .isLength({min: 2, max: 200}).withMessage("Min length 2 and max length 200 symbols"),
    inputValidationMiddleware
];