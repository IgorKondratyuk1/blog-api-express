import env from 'dotenv'
env.config();

export const SETTINGS = {
    JWT_SECRET: process.env.JWT_SECRET || "SecrEtToKeN11fsdagdsf",
    MONGO_URL: process.env.MONGO_URL || "mongodb://127.0.0.1:27017",
    MONGO_DB_NAME:  process.env.MONGO_DB_NAME || "blogApi",
    PORT: process.env.PORT || 7542,
    IS_LOCAL_VERSION: process.env.IS_LOCAL_VERSION === "true",
    GMAIL_LOGIN: process.env.GMAIL_LOGIN,
    GMAIL_PASS: process.env.GMAIL_PASS,
    ACCESS_TOKEN_EXPIRATION: process.env.ACCESS_TOKEN_EXPIRATION, // seconds
    REFRESH_TOKEN_EXPIRATION: process.env.REFRESH_TOKEN_EXPIRATION, // seconds
    EXTENDED_LOGS: process.env.EXTENDED_LOGS === "true",
    DEBOUNCE_TIME: Number(process.env.DEBOUNCE_TIME),
    EXPIRED_DEVICE_SESSION_DAYS: Number(process.env.EXPIRED_DEVICE_SESSION_DAYS)
}
