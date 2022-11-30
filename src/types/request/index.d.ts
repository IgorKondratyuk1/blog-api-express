import {UserAccountType} from "../user-types";

declare global {
    declare namespace Express {
        export interface Request {
            user: UserAccountType
            deviceId: string
            issuedAt: string
        }
    }
}