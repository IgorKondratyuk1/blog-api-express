import {UserAccountType, UserDBType, UserType} from "../types/user-types";
import {SETTINGS} from "../config";
import jwt from "jsonwebtoken";

export const jwtService = {
    async createJWT(user: UserAccountType) {
        const token = jwt.sign({userId: user.id}, SETTINGS.JWT_SECRET, {expiresIn: "1h"});
        return token;
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, SETTINGS.JWT_SECRET);
            return result.userId;
        } catch (error) {
            return null;
        }
    }
}