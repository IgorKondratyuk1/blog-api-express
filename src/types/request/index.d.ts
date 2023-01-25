import {GuestUserType, UserAccountType} from "../../01_domain/User/UserTypes";

declare global {
    declare namespace Express {
        export interface Request {
            //user: UserAccountType
            userId: string
            userLogin: string
            deviceId: string
            issuedAt: string
        }
    }
}