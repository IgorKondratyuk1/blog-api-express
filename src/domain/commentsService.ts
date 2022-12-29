import {v4 as uuidv4} from "uuid";
import {CreateCommentModel} from "../models/comment/createCommentModel";
import {UpdateCommentModel} from "../models/comment/updateCommentModel";
import {CommentType, CreateCommentDbType} from "../repositories/comments/commentSchema";
import {PostType} from "../repositories/posts/postSchema";
import {UserAccountType} from "../repositories/users/userSchema";
import {PostsRepository} from "../repositories/posts/postsRepository";
import {CommentsRepository} from "../repositories/comments/commentsRepository";
import {UsersRepository} from "../repositories/users/usersRepository";
import {LikesRepository} from "../repositories/likes/likesRepository";
import {LikeLocation, LikeStatus, LikeStatusType} from "../repositories/likes/likeSchema";
import {LikeError, LikeService} from "./likeService";

export enum CommentError {
    Success,
    WrongUserError,
    NotFoundError,
    CreationError
}

export class CommentsService {
    constructor(
        protected postsRepository: PostsRepository,
        protected commentsRepository: CommentsRepository,
        protected usersRepository: UsersRepository,
        protected likesRepository: LikesRepository,
        protected likeService: LikeService
    ) {}

    async findComment(id: string): Promise<CommentType | null> {
        const foundedComment: CommentType | null = await this.commentsRepository.findCommentById(id);
        return foundedComment;
    }

    async createComment(postId: string, userId: string, comment: CreateCommentModel): Promise<CommentType | CommentError> {
        const foundedPost: PostType | null = await this.postsRepository.findPostById(postId);
        const foundedUser: UserAccountType | null = await this.usersRepository.findUserById(userId)
        if (!foundedPost || !foundedUser) return CommentError.NotFoundError;

        const newComment: CreateCommentDbType = {
            id: uuidv4(),
            postId: foundedPost.id,
            content: comment.content,
            userId: foundedUser.id,
            userLogin: foundedUser.accountData.login,
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0
            }
        }
        const createdComment: CommentType = await this.commentsRepository.createComment(newComment)
        if (!createdComment) return CommentError.CreationError;

        return createdComment;
    }

    async updateComment(id: string, userId: string, comment: UpdateCommentModel): Promise<CommentError> {
        const foundedComment: CommentType | null = await this.commentsRepository.findCommentById(id);
        if (!foundedComment) return CommentError.NotFoundError;
        if (foundedComment.userId !== userId) return CommentError.WrongUserError;

        const result: boolean = await this.commentsRepository.updateComment(id, comment);
        if (!result) return CommentError.NotFoundError;

        return CommentError.Success;
    }

    async deleteComment(id: string, userId: string): Promise<CommentError> {
        // 1. Check user
        const foundedComment: CommentType | null = await this.commentsRepository.findCommentById(id);
        if (foundedComment && foundedComment.userId !== userId) return CommentError.WrongUserError;

        // 2. Delete comment likes
        const likesDeleteResult: boolean = await this.likesRepository.deleteLikesOfLocation(id, LikeLocation.Comment);

        // 3. Delete comment
        const commentDeleteResult: boolean = await this.commentsRepository.deleteComment(id);
        if (!commentDeleteResult) return CommentError.NotFoundError;

        return CommentError.Success;
    }

    async deleteAllComments() {
        await this.likesRepository.deleteAllLikes();
        return this.commentsRepository.deleteAllComments();
    }

    async likeComment(id: string, userId: string, status: LikeStatusType): Promise<LikeError> {
        const comment: CommentType | null = await this.findComment(id);
        if (!comment) return LikeError.NotFoundError;

        const result: LikeError = await this.likeService.like(userId, LikeLocation.Comment, comment.id, status);
        if (result !== LikeError.Success) return result;

        return await this.updateLikesDislikesCount(comment.id);
    }

    async updateLikesDislikesCount(commentId: string): Promise<LikeError> {
        const likesCount: number | null = await this.likesRepository.getLikesDislikesCount(commentId, LikeLocation.Comment, LikeStatus.Like);
        if (likesCount === null) return LikeError.NotFoundError;

        const dislikesCount: number | null = await this.likesRepository.getLikesDislikesCount(commentId, LikeLocation.Comment, LikeStatus.Dislike);
        if (dislikesCount === null) return LikeError.NotFoundError;

        const updateLikes: boolean = await this.commentsRepository.updateLikesCount(commentId, likesCount);
        if (!updateLikes) return LikeError.UpdateError;
        const updateDislikes: boolean = await this.commentsRepository.updateDislikesCount(commentId, dislikesCount);
        if (!updateDislikes) return LikeError.UpdateError;

        return LikeError.Success;
    }
}