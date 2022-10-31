import {MongoClient} from "mongodb";
import {UserAccountDbType} from "../types/user-types";
import {BlogDbType} from "../types/blog-types";
import {PostDbType} from "../types/post-types";
import {SETTINGS} from "../config";
import {CommentDbType} from "../types/comment-types";
import {RefreshTokenType} from "../types/types";

console.log("Env: " + SETTINGS.MONGO_URL);
const mongoURL: string = SETTINGS.MONGO_URL;
export const mongoClient = new MongoClient(mongoURL);

const db = mongoClient.db("network");
export const blogsCollection = db.collection<BlogDbType>("blogs");
export const postsCollection = db.collection<PostDbType>("posts");
export const usersCollection = db.collection<UserAccountDbType>("users");
export const commentsCollection = db.collection<CommentDbType>("comments");
export const tokensBlackListCollection = db.collection<RefreshTokenType>("refreshTokens");

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