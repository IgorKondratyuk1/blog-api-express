import {SETTINGS} from "../config";
import jwt from "jsonwebtoken";
import e from "express";

export type JWTDataType = {
    userId?: string
    refreshCode?: string
}

export const jwtService = {
    async createJWT(data: JWTDataType, jwtSecret: string, expiresTime: string | number): Promise<string> {
        const token: string = jwt.sign(data, jwtSecret, {expiresIn: expiresTime }) // expiresIn seconds
        return token;
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, SETTINGS.JWT_SECRET);
            return result.userId;
        } catch (error) {
            return null;
        }
    },
    async getDataByToken(token: string) {
        try {
            const result: any = jwt.verify(token, SETTINGS.JWT_SECRET);
            return result;
        } catch (error) {
            return null;
        }
    }
}