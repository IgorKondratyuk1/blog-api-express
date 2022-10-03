import {query} from "express-validator";
import {inputValidationMiddleware} from "../../middlewares/input-validation-middleware";

export const queryValidationSchema = [
    query("pageNumber")
        .toInt()
        .isNumeric({no_symbols: true}).withMessage("Field 'pageNumber' need to be a number")
        .optional(),
    query("pageSize")
        .toInt()
        .isNumeric({no_symbols: true}).withMessage("Field 'pageSize' need to be a number")
        .optional(),
    query("sortBy")
        .isString().withMessage("Field 'sortBy' need to be a string")
        .optional(),
    query("sortDirection")
        .isIn(["asc", "desc"]).withMessage("Field 'sortDirection' need to be asc or desc")
        .optional(),
    query("searchNameTerm")
        .isString().withMessage("Field 'searchNameTerm' need to be a string")
        .optional(),
    inputValidationMiddleware
];