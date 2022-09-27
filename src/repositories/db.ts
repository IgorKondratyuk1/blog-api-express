import * as dotenv from 'dotenv';
dotenv.config()
import {MongoClient} from "mongodb";
import {BlogType, PostType} from "../types/types";

const mongoURL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017";
export const mongoClient = new MongoClient(mongoURL);

const db = mongoClient.db("network");
export const blogsCollection = db.collection<BlogType>("blogs");
export const postsCollection = db.collection<PostType>("posts");

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