import {WithId} from "mongodb";
import mongoose from "mongoose";
import {LikeStatusType} from "../likes/likeSchema";

export type CommentType = {
    id: string
    content: string
    userId: string
    userLogin: string
    createdAt: Date
    updatedAt: Date
    likesInfo: {
        likesCount: number
        dislikesCount: number
    }
}

export type CommentDbType = WithId<{
    id: string
    content: string
    userId: string
    userLogin: string
    createdAt: Date
    updatedAt: Date
    postId: string
    likesInfo: {
        likesCount: number
        dislikesCount: number
    }
}>

export type CreateCommentDbType = {
    id: string
    content: string
    userId: string
    userLogin: string
    postId: string
    likesInfo: {
        likesCount: number
        dislikesCount: number
    }
}

export const commentSchema = new mongoose.Schema<CommentDbType>({
    id: {type: String, required: true},
    content: {type: String},
    userId: {type: String, required: true},
    userLogin: {type: String},
    createdAt: {type: Date},
    updatedAt: {type: Date},
    postId: {type: String, required: true},
    likesInfo: {
        likesCount: {type: Number, default: 0, min: 0},
        dislikesCount: {type: Number, default: 0, min: 0}
    }
}, {timestamps: true, optimisticConcurrency: true});

commentSchema.methods.incrementLike = function () {
    console.log(this);
}

export const CommentModel = mongoose.model('Comment', commentSchema);