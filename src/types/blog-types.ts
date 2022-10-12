import {ObjectId} from "mongodb";

export type BlogType = {
    id: string
    name: string
    youtubeUrl: string
    createdAt: string
}

export type BlogDbType = {
    _id: ObjectId
    id: string
    name: string
    youtubeUrl: string
    createdAt: string
}