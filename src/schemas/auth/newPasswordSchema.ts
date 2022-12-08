import {body} from "express-validator";
import {inputValidationMiddleware} from "../../middlewares/inputValidationMiddleware";

export const newPasswordValidationSchema = [
    body("newPassword")
        .exists({checkFalsy: true}).withMessage("Field 'newPassword' is not exist")
        .isString().withMessage("Field 'newPassword' is not string")
        .notEmpty({ignore_whitespace: true}).withMessage("Field 'newPassword' is empty")
        .trim()
        .isLength({min: 3, max: 200}).withMessage("Min length 2 and max length 200 symbols"),
    body("recoveryCode")
        .exists({checkFalsy: true}).withMessage("Field 'recoveryCode' is not exist")
        .isString().withMessage("Field 'recoveryCode' is not string")
        .notEmpty({ignore_whitespace: true}).withMessage("Field 'recoveryCode' is empty")
        .trim()
        .isLength({min: 3, max: 200}).withMessage("Min length 2 and max length 200 symbols"),
    inputValidationMiddleware
];