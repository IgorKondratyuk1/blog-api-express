import {v4 as uuidv4} from "uuid";
import {CreatePostModel} from "../models/post/createPostModel";
import {CreatePostOfBlogModel} from "../models/post/createPostOfBlog";
import {blogsRepository} from "../repositories/blogs/blogsRepository";
import {postsRepository} from "../repositories/posts/postsRepository";
import {UpdatePostModel} from "../models/post/updatePostModel";
import {CreatePostDbType, PostType} from "../repositories/posts/postSchema";

export enum PostError {
    NotFoundError,
}

export const postsService = {
    async createPost(blogId: string, post: CreatePostModel | CreatePostOfBlogModel): Promise<PostType | null> {
        const foundedBlog = await blogsRepository.findBlogById(blogId);
        if (!foundedBlog) {
            throw new Error("BlogId#'BlogId' is incorrect");
        }

        const newPost: CreatePostDbType = {
            id: uuidv4(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: foundedBlog.id,
            blogName: foundedBlog.name
        }

        return postsRepository.createPost(newPost);
    },
    async updatePost(id: string, post: UpdatePostModel): Promise<boolean | PostError> {
        const foundedBlog = await blogsRepository.findBlogById(post.blogId);
        if (!foundedBlog) return PostError.NotFoundError;

        return postsRepository.updatePost(id, post);
    },
    async deletePost(id: string): Promise<boolean> {
        return postsRepository.deletePost(id);
    },
    async deleteAllPosts() {
        return postsRepository.deleteAllPosts();
    }
}