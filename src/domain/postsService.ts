import {v4 as uuidv4} from "uuid";
import {ObjectId} from "mongodb";
import {PostDbType} from "../types/postTypes";
import {CreatePostModel} from "../models/post/createPostModel";
import {ViewPostModel} from "../models/post/viewPostModel";
import {CreatePostOfBlogModel} from "../models/post/createPostOfBlog";
import {blogsRepository} from "../repositories/blogs/blogsRepository";
import {postsRepository} from "../repositories/posts/postsRepository";
import {UpdatePostModel} from "../models/post/updatePostModel";

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