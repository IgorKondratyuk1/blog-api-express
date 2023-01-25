import {body} from "express-validator";
import {inputValidationMiddleware} from "../inputValidationMiddleware";
import {LikeStatus, LikeStatusType} from "../../01_domain/Like/likeTypes";

const likesTypes: string[] = Object.keys(LikeStatus);

export const likeValidation = [
    body("likeStatus")
        .exists({checkFalsy: true}).withMessage("Field 'likeStatus' is not exist")
        .isString().withMessage("Field 'likeStatus' is not string")
        .notEmpty({ignore_whitespace: true}).withMessage("Field 'likeStatus' is empty")
        .trim()
        .isIn(likesTypes).withMessage("Field 'likeStatus' is not in like/dislike/none"),
    inputValidationMiddleware
];