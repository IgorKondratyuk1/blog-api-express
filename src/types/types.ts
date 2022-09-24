import {Request} from "express";

export type APIErrorResult = {
    errorsMessages: Array<FieldError>
}

export type FieldError = {
    message: string
    field: string
}

export type BlogType = {
    id: string
    name: string
    youtubeUrl: string
}

export type PostType = {
    id:	string
    title: string
    shortDescription: string
    content: string
    blogId:	string
    blogName: string
}

export type RequestWithBody<T> = Request<{}, {}, T>
export type RequestWithQuery<T> = Request<{}, {}, {}, T>
export type RequestWithParams<T> = Request<T>
export type RequestWithBodyAndParams<T, B> = Request<T, {}, B>
