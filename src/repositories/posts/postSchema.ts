import {ObjectId, WithId} from "mongodb";
import mongoose from "mongoose";

export type PostType = {
    id:	string
    title: string
    shortDescription: string
    content: string
    blogId:	string
    blogName: string
    createdAt: Date
    updatedAt: Date
}

export type CreatePostDbType = {
    id:	string
    title: string
    shortDescription: string
    content: string
    blogId:	string
    blogName: string
}

export type PostDbType = WithId<{
    id:	string
    title: string
    shortDescription: string
    content: string
    blogId:	string
    blogName: string
    createdAt: Date
    updatedAt: Date
}>

export const postSchema = new mongoose.Schema<PostDbType>({
    id:	{ type: String, required: true },
    title: { type: String },
    shortDescription: { type: String },
    content: { type: String },
    blogId:	{ type: String, required: true },
    blogName: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date }
},{timestamps: true, optimisticConcurrency: true});

export const PostModel = mongoose.model('Post', postSchema);