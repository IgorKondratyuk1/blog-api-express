import {MongoClient} from "mongodb";
import {UserDBType} from "../types/user-types";
import {BlogDbType} from "../types/blog-types";
import {PostDbType} from "../types/post-types";
import {settings} from "../settings";
import {CommentDbType} from "../types/comment-types";

console.log("Env: " + settings.MONGO_URL);
const mongoURL: string = settings.MONGO_URL;
export const mongoClient = new MongoClient(mongoURL);

const db = mongoClient.db("network");
export const blogsCollection = db.collection<BlogDbType>("blogs");
export const postsCollection = db.collection<PostDbType>("posts");
export const usersCollection = db.collection<UserDBType>("users");
export const commentsCollection = db.collection<CommentDbType>("comments");

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