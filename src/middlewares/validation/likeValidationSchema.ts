import {body} from "express-validator";
import {inputValidationMiddleware} from "../inputValidationMiddleware";
import {LikeStatus, LikeStatusType} from "../../repositories/likes/likeSchema";

const likesTypes: string[] = Object.keys(LikeStatus);

export const likeValidationSchema = [
    body("likeStatus")
        .exists({checkFalsy: true}).withMessage("Field 'likeStatus' is not exist")
        .isString().withMessage("Field 'likeStatus' is not string")
        .notEmpty({ignore_whitespace: true}).withMessage("Field 'likeStatus' is empty")
        .trim()
        .isIn(likesTypes).withMessage("Field 'likeStatus' is not in like/dislike/none"),
    inputValidationMiddleware
];