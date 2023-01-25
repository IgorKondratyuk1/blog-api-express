import {body, CustomValidator} from "express-validator";
import {inputValidationMiddleware} from "../../inputValidationMiddleware";
import {UsersRepository} from "../../../repositories/users/usersRepository";

const usersRepository = new UsersRepository();

const isPasswordRecoveryCodeExists: CustomValidator = async (value, meta) => {
    const user = await usersRepository.findUserByPasswordConfirmationCode(value)
    if (!user) return Promise.reject(`${meta.path} "${value}" is not registered`);
    if (user.passwordRecovery.isUsed) return Promise.reject(`already recovered`);
    return Promise.resolve();
};

export const newPasswordValidation = [
    body("newPassword")
        .exists({checkFalsy: true}).withMessage("Field 'newPassword' is not exist")
        .isString().withMessage("Field 'newPassword' is not string")
        .notEmpty({ignore_whitespace: true}).withMessage("Field 'newPassword' is empty")
        .isLength({min: 6, max: 20}).withMessage("Min length 6 and max length 20 symbols"),
    body("recoveryCode")
        .exists({checkFalsy: true}).withMessage("Field 'recoveryCode' is not exist")
        .isString().withMessage("Field 'recoveryCode' is not string")
        .notEmpty({ignore_whitespace: true}).withMessage("Field 'recoveryCode' is empty")
        .trim()
        .isLength({min: 3, max: 200}).withMessage("Min length 2 and max length 200 symbols")
        .custom(isPasswordRecoveryCodeExists),
    inputValidationMiddleware
];