import {WithId} from "mongodb";
import mongoose from "mongoose";
import {SETTINGS} from "../../config";

export type CommentType = {
    id: string
    content: string
    userId: string
    userLogin: string
    createdAt: Date
    updatedAt: Date
}

export type CreateCommentDbType = {
    id: string
    content: string
    userId: string
    userLogin: string
    postId: string
}

export type CommentDbType = WithId<{
    id: string
    content: string
    userId: string
    userLogin: string
    createdAt: Date
    updatedAt: Date
    postId: string
}>

export const commentSchema = new mongoose.Schema<CommentDbType>({
    id: {type: String, required: true},
    content: {type: String},
    userId: {type: String, required: true},
    userLogin: {type: String},
    createdAt: {type: Date},
    updatedAt: {type: Date},
    postId: {type: String, required: true}
}, {timestamps: true, optimisticConcurrency: true});

export const CommentModel = mongoose.model('Comment', commentSchema);