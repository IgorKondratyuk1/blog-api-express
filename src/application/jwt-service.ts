import {UserDBType, UserType} from "../types/user-types";
import {settings} from "../settings";
import jwt from "jsonwebtoken";

export const jwtService = {
    async createJWT(user: UserDBType | UserType) {
        const token = jwt.sign({userId: user.id}, settings.JWT_SECRET, {expiresIn: "1h"});
        return token;
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET);
            return result.userId;
        } catch (error) {
            return null;
        }
    }
}