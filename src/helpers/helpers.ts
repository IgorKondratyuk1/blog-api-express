import {BlogViewModel} from "../models/blog/blog-view-model";
import {BlogType, PostType} from "../types/types";
import {PostViewModel} from "../models/post/post-view-model";

export const getBlogViewModel = (dbBlog: BlogType): BlogViewModel => {
    return {
        id: dbBlog.id,
        name: dbBlog.name,
        youtubeUrl: dbBlog.youtubeUrl
    }
}

export const getPostViewModel = (dbPost: PostType): PostViewModel => {
    return {
        id:	dbPost.id,
        title: dbPost.title,
        shortDescription: dbPost.shortDescription,
        content: dbPost.content,
        blogId:	dbPost.blogId,
        blogName: dbPost.blogName
    }
}