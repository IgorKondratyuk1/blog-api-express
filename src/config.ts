import env from 'dotenv'
env.config();

export const SETTINGS = {
    JWT_SECRET: process.env.JWT_SECRET || "SecrEtToKeN11fsdagdsf",
    MONGO_URL: process.env.MONGO_URL || "mongodb://127.0.0.1:27017", // mongodb+srv://Igor:qwerty123@cluster0.nlfaqr4.mongodb.net/?retryWrites=true&w=majority
    MONGO_DB_NAME:  process.env.MONGO_DB_NAME || "blogApi",
    PORT: process.env.PORT || 7542,
    IS_LOCAL_VERSION: Boolean(Number(process.env.IS_LOCAL_VERSION)),
    GMAIL_LOGIN: process.env.GMAIL_LOGIN,
    GMAIL_PASS: process.env.GMAIL_PASS,
    ACCESS_TOKEN_EXPIRATION: process.env.ACCESS_TOKEN_EXPIRATION, // seconds
    REFRESH_TOKEN_EXPIRATION: process.env.REFRESH_TOKEN_EXPIRATION, // seconds
    EXTENDED_LOGS: Boolean(Number(process.env.EXTENDED_LOGS)),
    DEBOUNCE_TIME: Number(process.env.DEBOUNCE_TIME)
}
