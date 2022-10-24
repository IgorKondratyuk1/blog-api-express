import env from 'dotenv'

const IS_LOCAL_VERSION = !process.env.PORT
IS_LOCAL_VERSION && env.config() // set env in developer mode

export const SETTINGS = {
    JWT_SECRET: process.env.JWT_SECRET || "SecrEtToKeN11fsdagdsf",
    MONGO_URL: process.env.MONGO_URL || "mongodb://127.0.0.1:27017",
    PORT: process.env.PORT || 7542,
    IS_LOCAL_VERSION,
    GMAIL_LOGIN: process.env.GMAIL_LOGIN,
    GMAIL_PASS: process.env.GMAIL_PASS,
}
