import {ObjectId} from "mongodb";

export type QueryUserModel = {
    searchLoginTerm?: string
    searchEmailTerm?: string
    pageNumber?: string
    pageSize?: string
    sortBy?: string
    sortDirection?: string
}

export type UserFilterType = {
    searchLoginTerm: string | null
    searchEmailTerm: string | null
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: "asc" | "desc"
}

export type AccountType = {
    login: string
    email: string
    passwordHash: string
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
    passwordRecovery: PasswordRecoveryType
}

export type UserAccountDbType = {
    _id: ObjectId
    id:	string
    accountData: AccountType,
    emailConfirmation: EmailConfirmationType,
    passwordRecovery: PasswordRecoveryType
}