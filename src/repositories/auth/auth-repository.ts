import {tokensBlackListCollection} from "../db";
import {RefreshTokenType} from "../../types/types";

export const refreshTokensRepository = {
    async findToken(token: string): Promise<RefreshTokenType | null> {
        const foundedToken: RefreshTokenType | null = await tokensBlackListCollection.findOne({token: token});
        return foundedToken;
    },
    async addToBlackList(tokenObj: RefreshTokenType): Promise<RefreshTokenType | null> {
        const result = await tokensBlackListCollection.insertOne(tokenObj);
        if (!result.insertedId) return null;
        return tokenObj;
    },
    async deleteAllTokens() {
        return tokensBlackListCollection.deleteMany({});
    }
}