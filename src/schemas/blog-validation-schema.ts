import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";

export const blogValidationSchema = [
    body("name")
        .exists({checkFalsy: true}).withMessage("Field 'name' is not exist")
        .isString().withMessage("Field 'name' is not string")
        .notEmpty({ignore_whitespace: true}).withMessage("Field 'name' is empty")
        .trim()
        .isLength({min: 1, max: 15}).withMessage("Min length 1 and max length 15 symbols"),
    body("youtubeUrl")
        .exists({checkFalsy: true}).withMessage("Field 'youtubeUrl' is not exist")
        .isString().withMessage("Field 'youtubeUrl' is not string")
        .notEmpty({ignore_whitespace: true}).withMessage("Field 'youtubeUrl' is empty")
        .trim()
        .isLength({min: 1, max: 100}).withMessage("Min length 1 and max length 100 symbols")
        .isURL().withMessage("Field 'youtubeUrl' consists not url string"),
    inputValidationMiddleware
];