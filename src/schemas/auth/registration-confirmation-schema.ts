import {body, CustomValidator} from "express-validator";
import {inputValidationMiddleware} from "../../middlewares/input-validation-middleware";
import {usersRepository} from "../../repositories/users/users-repository";

const isConfirmationCodeExists: CustomValidator = async (value, meta) => {
    const user = await usersRepository.findUserByConfirmationCode(value)
    if (!user) return Promise.reject(`${meta.path} "${value}" is not registered`);
    return Promise.resolve();
};

export const registrationConfirmationValidationSchema = [
    body("code")
        .exists({checkFalsy: true}).withMessage("Field 'code' is not exist")
        .isString().withMessage("Field 'code' is not string")
        .notEmpty({ignore_whitespace: true}).withMessage("Field 'code' is empty")
        .trim()
        .isLength({min: 3, max: 200}).withMessage("Min length 2 and max length 200 symbols")
        .custom(isConfirmationCodeExists),
    inputValidationMiddleware
];