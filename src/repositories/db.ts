import {SETTINGS} from "../config";
import mongoose from "mongoose";

console.log("Env: " + SETTINGS.MONGO_URL);
const mongoURL: string = SETTINGS.MONGO_URL;
const mongoDBName: string = SETTINGS.MONGO_DB_NAME;

// export const mongoClient = new MongoClient(mongoURL);
// const db = mongoClient.db("network");

//export const blogsCollection = db.collection<BlogDbType>("blogs");
//export const commentsCollection = db.collection<CommentDbType>("comments");
//export const postsCollection = db.collection<PostDbType>("posts");
//export const usersCollection = db.collection<UserAccountDbType>("users");
//export const securityCollection = db.collection<DeviceDBType>("security");
//export const userActionsCollection = db.collection<UserActionsDbType>("userActions");

// export async function connectToDB() {
//     try{
//         await mongoClient.connect();
//         await mongoClient.db("shop").command({ ping: 1 });
//         console.log('Successfully connected to MongoDB!');
//     } catch (error) {
//         console.error('Connection to MongoDB! Error: ', error);
//         await mongoClient.close();
//     }
// }

export async function mongooseConnectToDB() {
    try{
        await mongoose.connect(mongoURL + "/" + mongoDBName);
        console.log('Mongoose successfully connected to MongoDB!');
    } catch (error) {
        console.error('Mongoose connection to MongoDB! Error: ', error);
        await mongoose.disconnect();
    }
}