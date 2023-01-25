import mongoose from "mongoose";
import {PasswordRecoveryType} from "./UserTypes";

export const passwordRecoverySchema = new mongoose.Schema<PasswordRecoveryType>({
    recoveryCode: {type: String},
    expirationDate: {type: String},
    isUsed: {type: Boolean}
});