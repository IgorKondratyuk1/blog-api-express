import mongoose from "mongoose";
import {EmailConfirmationType} from "./UserTypes";

export const emailConfirmationSchema = new mongoose.Schema<EmailConfirmationType>({
    confirmationCode: {type: String},
    expirationDate: {type: String},
    isConfirmed: {type: Boolean}
});