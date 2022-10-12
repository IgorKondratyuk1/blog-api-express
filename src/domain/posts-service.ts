import {v4 as uuidv4} from "uuid";
import {postsRepository} from "../repositories/posts/posts-repository";
import {blogsRepository} from "../repositories/blogs/blogs-repository";
import {ViewPostModel} from "../models/post/view-post-model";
import {CreatePostModel} from "../models/post/create-post-model";
import {UpdatePostModel} from "../models/post/update-post-model";
import {CreatePostOfBlogModel} from "../models/post/create-post-of-blog";
import {PostDbType} from "../types/post-types";
import {ObjectId} from "mongodb";

export const postsService = {
    async createPost(blogId: string, post: CreatePostModel | CreatePostOfBlogModel): Promise<ViewPostModel> {
        const foundedBlog = await blogsRepository.findBlogById(blogId);
        if (!foundedBlog) {
            throw new Error("BlogId#'BlogId' is incorrect");
        }

        const newPost: PostDbType = {
            _id: new ObjectId(),
            id: uuidv4(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: foundedBlog.id,
            blogName: foundedBlog.name,
            createdAt: (new Date()).toISOString()
        }

        return postsRepository.createPost(newPost);
    },
    async updatePost(id: string, post: UpdatePostModel): Promise<boolean> {
        const foundedBlog = await blogsRepository.findBlogById(post.blogId);
        if (!foundedBlog) {
            throw new Error("BlogId#'BlogId' is incorrect");
        }

        return postsRepository.updatePost(id, post);
    },
    async deletePost(id: string): Promise<boolean> {
        return postsRepository.deletePost(id);
    },
    async deleteAllPosts() {
        return postsRepository.deleteAllPosts();
    }
}