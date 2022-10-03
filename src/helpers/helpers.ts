import {ViewBlogModel} from "../models/blog/view-blog-model";
import {BlogType, PostType} from "../types/types";
import {ViewPostModel} from "../models/post/view-post-model";

export const getBlogViewModel = (dbBlog: BlogType): ViewBlogModel => {
    return {
        id: dbBlog.id,
        name: dbBlog.name,
        youtubeUrl: dbBlog.youtubeUrl,
        createdAt: dbBlog.createdAt
    }
}

export const getPostViewModel = (dbPost: PostType): ViewPostModel => {
    return {
        id:	dbPost.id,
        title: dbPost.title,
        shortDescription: dbPost.shortDescription,
        content: dbPost.content,
        blogId:	dbPost.blogId,
        blogName: dbPost.blogName,
        createdAt: dbPost.createdAt
    }
}