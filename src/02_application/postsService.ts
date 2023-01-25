import {CreatePostModel} from "../models/post/createPostModel";
import {CreatePostOfBlogModel} from "../models/post/createPostOfBlog";
import {UpdatePostModel} from "../models/post/updatePostModel";
import {BlogsRepository} from "../repositories/blogs/blogsRepository";
import {PostsRepository} from "../repositories/posts/postsRepository";
import {inject, injectable} from "inversify";
import {HydratedPost} from "../01_domain/Post/postTypes";
import {Post} from "../01_domain/Post/postSchema";
import {LikeDbType, LikeLocation, LikeStatus, LikeStatusType} from "../01_domain/Like/likeTypes";
import {LikeError, LikeService} from "./likeService";
import {HydratedComment} from "../01_domain/Comment/commentTypes";
import {Like} from "../01_domain/Like/likeSchema";
import {CommentError} from "./commentsService";
import {ViewPostModel} from "../models/post/viewPostModel";
import {LikesRepository} from "../repositories/likes/likesRepository";
import {mapPostTypeToPostViewModel} from "../helpers/mappers";

export enum PostError {
    Success,
    NotFoundError,
    CreationError
}

@injectable()
export class PostsService {
    constructor(
        @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
        @inject(PostsRepository) protected postsRepository: PostsRepository,
        @inject(LikeService) protected likeService: LikeService,
        @inject(LikesRepository) protected likesRepository: LikesRepository
    ) {}

    async createPost(userId: string, blogId: string, post: CreatePostModel | CreatePostOfBlogModel): Promise<ViewPostModel | null> {
        const foundedBlog = await this.blogsRepository.findBlogById(blogId);
        if (!foundedBlog) return null;

        const createdPost: HydratedPost = await Post.createInstance(post.title, post.shortDescription, post.content, foundedBlog.id, foundedBlog.name);
        const lastLikes: LikeDbType[] | null = await this.likesRepository.getLastLikesInfo(createdPost.id, LikeLocation.Post, 3);
        const likeStatus: LikeStatusType = await Like.getUserLikeStatus(userId, createdPost.id, LikeLocation.Post);

        return mapPostTypeToPostViewModel(createdPost, likeStatus, lastLikes);
    }
    async updatePost(id: string, post: UpdatePostModel): Promise<boolean | PostError> {
        const foundedBlog = await this.blogsRepository.findBlogById(post.blogId);
        if (!foundedBlog) return PostError.NotFoundError;

        const foundedPost: HydratedPost | null = await this.postsRepository.findPostById(id);
        if (!foundedPost) return PostError.NotFoundError;

        await foundedPost.updatePost(post.blogId, post.content, post.title, post.shortDescription);
        await this.postsRepository.save(foundedPost);

        return true;
    }
    async deletePost(id: string): Promise<boolean> {
        return this.postsRepository.deletePost(id);
    }
    async deleteAllPosts() {
        return this.postsRepository.deleteAllPosts();
    }

    // Likes
    async likePost(id: string, userId: string, userLogin: string, status: LikeStatusType): Promise<PostError> {
        const post: HydratedPost | null = await this.postsRepository.findPostById(id);
        if (!post) return PostError.NotFoundError;

        const result: LikeError = await this.likeService.like(userId, userLogin, LikeLocation.Post, post.id, status);
        if (result !== LikeError.Success) return PostError.CreationError;

        return await this.updateLikesDislikesCount(post.id);
    }
    async updateLikesDislikesCount(postId: string): Promise<PostError> {
        const post: HydratedPost | null = await this.postsRepository.findPostById(postId);
        if (!post) return PostError.NotFoundError;

        const likesCount: number = await Like.getLikesOrDislikesCount(postId, LikeLocation.Post, LikeStatus.Like);
        const dislikesCount: number = await Like.getLikesOrDislikesCount(postId, LikeLocation.Post, LikeStatus.Dislike);

        await post.setLikesCount(likesCount);
        await post.setDislikesCount(dislikesCount);
        await this.postsRepository.save(post);

        return PostError.Success;
    }
}