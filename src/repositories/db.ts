import {MongoClient} from "mongodb";
import {SETTINGS} from "../config";
import {DeviceDBType} from "../types/deviceTypes";
import {BlogDbType} from "../types/blogTypes";
import {PostDbType} from "../types/postTypes";
import {UserAccountDbType} from "../types/userTypes";
import {CommentDbType} from "../types/commentTypes";
import {UserActionsDbType} from "../types/userActionTypes";

console.log("Env: " + SETTINGS.MONGO_URL);
const mongoURL: string = SETTINGS.MONGO_URL;
export const mongoClient = new MongoClient(mongoURL);

const db = mongoClient.db("network");
export const blogsCollection = db.collection<BlogDbType>("blogs");
export const postsCollection = db.collection<PostDbType>("posts");
export const usersCollection = db.collection<UserAccountDbType>("users");
export const commentsCollection = db.collection<CommentDbType>("comments");
export const securityCollection = db.collection<DeviceDBType>("security");
export const userActionsCollection = db.collection<UserActionsDbType>("userActions");

export async function connectToDB() {
    try{
        await mongoClient.connect();
        await mongoClient.db("shop").command({ ping: 1 });
        console.log('Successfully connected to MongoDB!');
    } catch (error) {
        console.error('Connection to MongoDB! Error: ', error);
        await mongoClient.close();
    }
}