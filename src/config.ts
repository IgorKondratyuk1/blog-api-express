import env from 'dotenv'

const IS_LOCAL_VERSION = !process.env.PORT
IS_LOCAL_VERSION && env.config() // set env in developer mode

export const SETTINGS = {
    JWT_SECRET: process.env.JWT_SECRET || "SecrEtToKeN11fsdagdsf",
    MONGO_URL: process.env.MONGO_URL || "mongodb://127.0.0.1:27017", // mongodb+srv://Igor:qwerty123@cluster0.nlfaqr4.mongodb.net/?retryWrites=true&w=majority
    PORT: process.env.PORT || 7542,
    IS_LOCAL_VERSION,
    GMAIL_LOGIN: process.env.GMAIL_LOGIN,
    GMAIL_PASS: process.env.GMAIL_PASS,
    ACCESS_TOKEN_EXPIRATION: process.env.ACCESS_TOKEN_EXPIRATION, // seconds
    REFRESH_TOKEN_EXPIRATION: process.env.REFRESH_TOKEN_EXPIRATION, // seconds
    EXTENDED_LOGS: Boolean(process.env.EXTENDED_LOGS),
    DEBOUNCE_TIME: Number(process.env.DEBOUNCE_TIME)
}
