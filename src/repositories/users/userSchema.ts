import {WithId} from "mongodb";
import mongoose from "mongoose";

export type AccountType = {
    login: string
    email: string
    passwordHash: string,
    createdAt: string
}

export type EmailConfirmationType = {
    confirmationCode: string,
    expirationDate: string,
    isConfirmed: boolean
}

export type PasswordRecoveryType = {
    recoveryCode?: string,
    expirationDate?: string,
    isUsed?: boolean
}

export type UserAccountType = {
    id:	string,
    accountData: AccountType,
    emailConfirmation: EmailConfirmationType,
    passwordRecovery: PasswordRecoveryType,
    createdAt: Date,
    updatedAt: Date
}

export type CreateUserAccountDbType = {
    id:	string,
    accountData: AccountType,
    emailConfirmation: EmailConfirmationType,
    passwordRecovery: PasswordRecoveryType
}

export type UserAccountDbType = WithId<{
    id:	string
    accountData: AccountType,
    emailConfirmation: EmailConfirmationType,
    passwordRecovery: PasswordRecoveryType,
    createdAt: Date,
    updatedAt: Date
}>

const passwordRecoverySchema = new mongoose.Schema<PasswordRecoveryType>({
    recoveryCode: { type: String },
    expirationDate: { type: String },
    isUsed: { type: Boolean }
});

const emailConfirmationSchema = new mongoose.Schema<EmailConfirmationType>({
    confirmationCode: { type: String },
    expirationDate: { type: String },
    isConfirmed: { type: Boolean }
});

const accountSchema = new mongoose.Schema<AccountType>({
    login: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    createdAt: { type: String }
});

export const userSchema = new mongoose.Schema<UserAccountDbType>({
    id: { type: String },
    accountData: { type: accountSchema },
    emailConfirmation: { type: emailConfirmationSchema },
    passwordRecovery: { type: passwordRecoverySchema },
    createdAt: Date,
    updatedAt: Date
},{timestamps: true, optimisticConcurrency: true});

export const UserModel = mongoose.model('User', userSchema);