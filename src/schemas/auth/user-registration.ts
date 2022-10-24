import {body} from "express-validator";
import {inputValidationMiddleware} from "../../middlewares/input-validation-middleware";

export const userRegistrationValidationSchema = [
    body("login")
        .exists({checkFalsy: true}).withMessage("Field 'login' is not exist")
        .isString().withMessage("Field 'login' is not string")
        .notEmpty({ignore_whitespace: true}).withMessage("Field 'login' is empty")
        .trim()
        .isLength({min: 3, max: 10}).withMessage("Min length 3 and max length 10 symbols"),
    body("password")
        .exists({checkFalsy: true}).withMessage("Field 'password' is not exist")
        .isString().withMessage("Field 'password' is not string")
        .notEmpty({ignore_whitespace: true}).withMessage("Field 'password' is empty")
        .isLength({min: 6, max: 20}).withMessage("Min length 6 and max length 20 symbols"),
    body("email")
        .exists({checkFalsy: true}).withMessage("Field 'email' is not exist")
        .isString().withMessage("Field 'email' is not string")
        .notEmpty({ignore_whitespace: true}).withMessage("Field 'email' is empty")
        .trim()
        .isEmail(),
    inputValidationMiddleware
];