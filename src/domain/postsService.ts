import {v4 as uuidv4} from "uuid";
import {CreatePostModel} from "../models/post/createPostModel";
import {CreatePostOfBlogModel} from "../models/post/createPostOfBlog";
import {UpdatePostModel} from "../models/post/updatePostModel";
import {CreatePostDbType, PostType} from "../repositories/posts/postSchema";
import {BlogsRepository} from "../repositories/blogs/blogsRepository";
import {PostsRepository} from "../repositories/posts/postsRepository";

export enum PostError {
    NotFoundError,
}

export class PostsService {
    constructor(
        protected blogsRepository: BlogsRepository,
        protected postsRepository: PostsRepository
    ) {}

    async createPost(blogId: string, post: CreatePostModel | CreatePostOfBlogModel): Promise<PostType | null> {
        const foundedBlog = await this.blogsRepository .findBlogById(blogId);
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

        return this.postsRepository.createPost(newPost);
    }
    async updatePost(id: string, post: UpdatePostModel): Promise<boolean | PostError> {
        const foundedBlog = await this.blogsRepository .findBlogById(post.blogId);
        if (!foundedBlog) return PostError.NotFoundError;

        return this.postsRepository.updatePost(id, post);
    }
    async deletePost(id: string): Promise<boolean> {
        return this.postsRepository.deletePost(id);
    }
    async deleteAllPosts() {
        return this.postsRepository.deleteAllPosts();
    }
}