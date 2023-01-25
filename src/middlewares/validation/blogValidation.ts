import {body} from "express-validator";
import {inputValidationMiddleware} from "../inputValidationMiddleware";

export const blogValidation = [
    body("name")
        .exists({checkFalsy: true}).withMessage("Field 'name' is not exist")
        .isString().withMessage("Field 'name' is not string")
        .notEmpty({ignore_whitespace: true}).withMessage("Field 'name' is empty")
        .trim()
        .isLength({min: 1, max: 15}).withMessage("Min length 1 and max length 15 symbols"),
    body("websiteUrl")
        .exists({checkFalsy: true}).withMessage("Field 'websiteUrl' is not exist")
        .isString().withMessage("Field 'websiteUrl' is not string")
        .notEmpty({ignore_whitespace: true}).withMessage("Field 'websiteUrl' is empty")
        .trim()
        .isLength({min: 1, max: 100}).withMessage("Min length 1 and max length 100 symbols")
        .isURL().withMessage("Field 'websiteUrl' consists not url string"),
    body("description")
        .exists({checkFalsy: true}).withMessage("Field 'description' is not exist")
        .isString().withMessage("Field 'description' is not string")
        .notEmpty({ignore_whitespace: true}).withMessage("Field 'description' is empty")
        .trim()
        .isLength({min: 1, max: 500}).withMessage("Min length 1 and max length 500 symbols"),
    inputValidationMiddleware
];