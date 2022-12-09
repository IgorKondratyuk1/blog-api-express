import {body, CustomValidator} from "express-validator";
import {usersRepository} from "../../../repositories/users/usersRepository";
import {inputValidationMiddleware} from "../../inputValidationMiddleware";

const isEmailExists: CustomValidator = async (value, meta) => {
    const user = await usersRepository.findUserByLoginOrEmail(value);
    if (!user) return Promise.reject(`${meta.path} "${value}" is not registered`);
    if (user.emailConfirmation.isConfirmed) return Promise.reject(`already confirmed`);
    return Promise.resolve();
};

export const registrationEmailResendingValidationSchema = [
    body("email")
        .exists({checkFalsy: true}).withMessage("Field 'email' is not exist")
        .isString().withMessage("Field 'email' is not string")
        .notEmpty({ignore_whitespace: true}).withMessage("Field 'email' is empty")
        .isLength({min: 3, max: 200}).withMessage("Min length 3 and max length 200 symbols")
        .trim()
        .isEmail()
        .custom(isEmailExists),
    inputValidationMiddleware
];