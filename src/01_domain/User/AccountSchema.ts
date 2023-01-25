import mongoose from "mongoose";
import {AccountType} from "./UserTypes";

export const accountSchema = new mongoose.Schema<AccountType>({
    login: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    passwordHash: {type: String, required: true},
    createdAt: {type: String}
});