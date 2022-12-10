import mongoose from "mongoose";
import {WithId} from 'mongodb';
import {SETTINGS} from "../../config";

export type BlogType = {
    id: string
    name: string
    websiteUrl: string
    createdAt: Date
    updatedAt: Date
    description: string
}

export type CreateBlogDbType = {
    id: string
    name: string
    websiteUrl: string
    description: string
}

export type BlogDbType = WithId<{
    id: string
    name: string
    websiteUrl: string
    createdAt: Date
    updatedAt: Date
    description: string
}>

export const blogSchema = new mongoose.Schema<BlogDbType>({
    id: {type: String, required: true},
    name: {type: String},
    websiteUrl: {type: String, maxlength: 300},
    createdAt: {type: Date},
    updatedAt: {type: Date},
    description: {type: String, maxlength: 1000}
},{timestamps: true, optimisticConcurrency: true});

export const BlogModel = mongoose.model('Blog', blogSchema);