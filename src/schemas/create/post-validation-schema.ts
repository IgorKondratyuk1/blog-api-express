import {body, CustomValidator} from "express-validator";
import {inputValidationMiddleware} from "../../middlewares/input-validation-middleware";
import {blogsRepository} from "../../repositories/blogs/blogs-repository";
import {blogsQueryRepository} from "../../repositories/blogs/query-blog-repository";

const isValidBlogId: CustomValidator = async (value) => {
    const blog = await blogsQueryRepository.findBlogById(value);

    if (!blog) return Promise.reject("Invalid blogId");

    return Promise.resolve();
};

export const postValidationSchema = [
    body("title")
        .exists({checkFalsy: true}).withMessage("Field 'title' is not exist")
        .isString().withMessage("Field 'title' is not string")
        .notEmpty({ignore_whitespace: true}).withMessage("Field 'title' is empty")
        .trim()
        .isLength({min: 1, max: 30}).withMessage("Min length 1 and max length 30 symbols"),
    body("shortDescription")
        .exists({checkFalsy: true}).withMessage("Field 'shortDescription' is not exist")
        .isString().withMessage("Field 'shortDescription' is not string")
        .notEmpty({ignore_whitespace: true}).withMessage("Field 'shortDescription' is empty")
        .trim()
        .isLength({min: 1, max: 100}).withMessage("Min length 1 and max length 100 symbols"),
    body("content")
        .exists({checkFalsy: true}).withMessage("Field 'content' is not exist")
        .isString().withMessage("Field 'content' is not string")
        .notEmpty({ignore_whitespace: true}).withMessage("Field 'content' is empty")
        .trim()
        .isLength({min: 1, max: 1000}).withMessage("Min length 1 and max length 1000 symbols"),
    body("blogId")
        .exists({checkFalsy: true}).withMessage("Field 'blogId' is not exist")
        .isString().withMessage("Field 'blogId' is not string")
        .notEmpty({ignore_whitespace: true}).withMessage("Field 'blogId' is empty")
        .trim()
        .custom(isValidBlogId),
    inputValidationMiddleware
];