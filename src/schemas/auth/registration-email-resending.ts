import {body} from "express-validator";
import {inputValidationMiddleware} from "../../middlewares/input-validation-middleware";

export const registrationEmailResendingValidationSchema = [
    body("email")
        .exists({checkFalsy: true}).withMessage("Field 'email' is not exist")
        .isString().withMessage("Field 'email' is not string")
        .notEmpty({ignore_whitespace: true}).withMessage("Field 'email' is empty")
        .trim()
        .isEmail(),
    inputValidationMiddleware
];