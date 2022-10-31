import {UserAccountType} from "../user-types";

declare global {
    declare namespace Express {
        export interface Request {
            user: UserAccountType | null,
            // refreshToken: string | null
        }
    }
}