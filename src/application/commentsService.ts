import {CreateCommentModel} from "../models/comment/createCommentModel";
import {UpdateCommentModel} from "../models/comment/updateCommentModel";
import {PostsRepository} from "../repositories/posts/postsRepository";
import {CommentsRepository} from "../repositories/comments/commentsRepository";
import {UsersRepository} from "../repositories/users/usersRepository";
import {LikesRepository} from "../repositories/likes/likesRepository";
import {LikeError, LikeService} from "./likeService";
import {inject, injectable} from "inversify";
import {LikeLocation, LikeStatus, LikeStatusType} from "../domain/Like/likeTypes";
import {Like} from "../domain/Like/likeSchema";
import {HydratedUser} from "../domain/User/UserTypes";
import {HydratedComment} from "../domain/Comment/commentTypes";
import {Comment} from "../domain/Comment/commentSchema";
import {PostType} from "../domain/Post/postTypes";

export enum CommentError {
    Success,
    WrongUserError,
    NotFoundError,
    CreationError
}

@injectable()
export class CommentsService {
    constructor(
        @inject(PostsRepository) protected postsRepository: PostsRepository,
        @inject(CommentsRepository) protected commentsRepository: CommentsRepository,
        @inject(UsersRepository) protected usersRepository: UsersRepository,
        @inject(LikesRepository) protected likesRepository: LikesRepository,
        @inject(LikeService) protected likeService: LikeService
    ) {}

    async createComment(postId: string, userId: string, comment: CreateCommentModel): Promise<HydratedComment | CommentError> {
        const foundedPost: PostType | null = await this.postsRepository.findPostById(postId);
        const foundedUser: HydratedUser | null = await this.usersRepository.findUserById(userId)
        if (!foundedPost || !foundedUser) return CommentError.NotFoundError;

        const createdComment: HydratedComment = await Comment.createInstance(foundedPost.id, foundedUser.id, foundedUser.accountData.login, comment.content);
        if (!createdComment) return CommentError.CreationError;

        return createdComment;
    }
    async updateComment(id: string, userId: string, newComment: UpdateCommentModel): Promise<CommentError> {
        const foundedComment: HydratedComment | null = await this.commentsRepository.findCommentById(id);
        if (!foundedComment) return CommentError.NotFoundError;
        if (foundedComment.userId !== userId) return CommentError.WrongUserError;

        foundedComment.content = newComment.content;
        await this.commentsRepository.save(foundedComment);

        return CommentError.Success;
    }
    async deleteComment(id: string, userId: string): Promise<CommentError> {
        // 1. Check user
        const foundedComment: HydratedComment | null = await this.commentsRepository.findCommentById(id);
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

    // Likes
    async likeComment(id: string, userId: string, userLogin: string, status: LikeStatusType): Promise<CommentError> {
        const comment: HydratedComment | null = await this.commentsRepository.findCommentById(id);
        if (!comment) return CommentError.NotFoundError;

        const result: LikeError = await this.likeService.like(userId, userLogin, LikeLocation.Comment, comment.id, status);
        if (result !== LikeError.Success) return CommentError.CreationError;

        return await this.updateLikesDislikesCount(comment.id);
    }
    async updateLikesDislikesCount(commentId: string): Promise<CommentError> {
        const comment: HydratedComment | null = await this.commentsRepository.findCommentById(commentId);
        if (!comment) return CommentError.NotFoundError;

        const likesCount: number = await Like.getLikesOrDislikesCount(commentId, LikeLocation.Comment, LikeStatus.Like);
        const dislikesCount: number = await Like.getLikesOrDislikesCount(commentId, LikeLocation.Comment, LikeStatus.Dislike);

        await comment.setLikesCount(likesCount);
        await comment.setDislikesCount(dislikesCount);
        await this.commentsRepository.save(comment);

        return CommentError.Success;
    }
}