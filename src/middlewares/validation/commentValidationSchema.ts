import {body} from "express-validator";
import {inputValidationMiddleware} from "../inputValidationMiddleware";

export const commentValidationSchema = [
    body("content")
        .exists({checkFalsy: true}).withMessage("Field 'content' is not exist")
        .isString().withMessage("Field 'content' is not string")
        .notEmpty({ignore_whitespace: true}).withMessage("Field 'content' is empty")
        .trim()
        .isLength({min: 20, max: 300}).withMessage("Min length 20 and max length 300 symbols"),
    inputValidationMiddleware
];