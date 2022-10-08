import {MongoClient} from "mongodb";
import {BlogType, PostType} from "../types/types";
import {envConfig} from "../env-config";
import {UserDBType} from "../types/user-types";

console.log("Env: " + envConfig.MONGO_URL);
const mongoURL: string = envConfig.MONGO_URL;
export const mongoClient = new MongoClient(mongoURL);

const db = mongoClient.db("network");
export const blogsCollection = db.collection<BlogType>("blogs");
export const postsCollection = db.collection<PostType>("posts");
export const usersCollection = db.collection<UserDBType>("users");

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