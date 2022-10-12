import 'dotenv/config';

export const settings = {
    JWT_SECRET: process.env.JWT_SECRET || "123",
    MONGO_URL: process.env.ENVIRONMENT === 'prod' ? (process.env.MONGO_URL || "mongodb://127.0.0.1:27017") : "mongodb://127.0.0.1:27017"
}