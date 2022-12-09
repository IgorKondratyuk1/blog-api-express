import {v4 as uuidv4} from "uuid";
import {CreateCommentModel} from "../models/comment/createCommentModel";
import {postsRepository} from "../repositories/posts/postsRepository";
import {commentsRepository} from "../repositories/comments/commentsRepository";
import {UpdateCommentModel} from "../models/comment/updateCommentModel";
import {usersRepository} from "../repositories/users/usersRepository";
import {CommentType, CreateCommentDbType} from "../repositories/comments/commentSchema";
import {PostType} from "../repositories/posts/postSchema";
import {UserAccountType} from "../repositories/users/userSchema";

export enum CommentError {
    Success,
    WrongUserError,
    NotFoundError
}

export const commentsService = {
    async createComment(postId: string, userId: string, comment: CreateCommentModel): Promise<CommentType | CommentError> {
        const foundedPost: PostType | null  = await postsRepository.findPostById(postId);
        const foundedUser: UserAccountType | null = await usersRepository.findUserById(userId)
        if (!foundedPost || !foundedUser) return CommentError.NotFoundError;

        const newComment: CreateCommentDbType = {
            id: uuidv4(),
            postId: foundedPost.id,
            content: comment.content,
            userId: foundedUser.id,
            userLogin: foundedUser.accountData.login
        }

        return await commentsRepository.createComment(newComment);
    },
    async updateComment(id: string, userId: string, comment: UpdateCommentModel): Promise<CommentError> {
        const foundedComment: CommentType | null = await commentsRepository.findCommentById(id);
        if (foundedComment && foundedComment.userId !== userId) return CommentError.WrongUserError;

        const result: boolean = await commentsRepository.updateComment(id, comment);
        if (!result) return CommentError.NotFoundError;

        return CommentError.Success;
    },
    async deleteComment(id: string, userId: string): Promise<CommentError> {
        const foundedComment: CommentType | null = await commentsRepository.findCommentById(id);
        if (foundedComment && foundedComment.userId !== userId) return CommentError.WrongUserError;

        const result: boolean = await commentsRepository.deleteComment(id);
        if (!result) return CommentError.NotFoundError;

        return CommentError.Success;
    },
    async deleteAllComments() {
        return commentsRepository.deleteAllComments();
    }
}