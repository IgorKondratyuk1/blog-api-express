import {PostType} from "../types/types";
import {postsRepository} from "../repositories/posts/posts-repository";
import {blogsRepository} from "../repositories/blogs/blogs-repository";
import {ViewPostModel} from "../models/post/view-post-model";

export const postsService = {
    async createPost(title: string, shortDescription: string,
                     content: string, blogId: string): Promise<ViewPostModel> {

        const foundedBlog = await blogsRepository.findBlogById(blogId);
        if (!foundedBlog) {
            throw new Error("BlogId#'BlogId' is incorrect");
        }

        const newPost: PostType = {
            id: (+new Date()).toString(),
            title,
            shortDescription,
            content,
            blogId,
            blogName: foundedBlog.name,
            createdAt: (new Date()).toISOString()
        }

        return postsRepository.createPost(newPost);
    },
    async updatePost(id: string, title: string, shortDescription: string,
                     content: string, blogId: string): Promise<boolean> {

        const foundedBlog = await blogsRepository.findBlogById(blogId);
        if (!foundedBlog) {
            throw new Error("BlogId#'BlogId' is incorrect");
        }

        return postsRepository.updatePost(id, title, shortDescription, content, blogId);
    },
    async deletePost(id: string): Promise<boolean> {
        return postsRepository.deletePost(id);
    },
    async deleteAllPosts() {
        return postsRepository.deleteAllPosts();
    }
}