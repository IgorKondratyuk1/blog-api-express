import {SETTINGS} from "../config";
import mongoose from "mongoose";

let mongoURL: string = SETTINGS.MONGO_URL;
if (SETTINGS.IS_LOCAL_VERSION) { mongoURL += SETTINGS.MONGO_DB_NAME }

console.log("MongoDB is running on: " + mongoURL);

export async function mongooseConnectToDB() {
    try{
        await mongoose.connect(mongoURL);
        console.log('Mongoose successfully connected to MongoDB!');
    } catch (error) {
        console.error('Mongoose connection to MongoDB! Error: ', error);
        await mongoose.disconnect();
    }
}