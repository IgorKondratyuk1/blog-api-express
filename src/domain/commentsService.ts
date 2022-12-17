import {v4 as uuidv4} from "uuid";
import {CreateCommentModel} from "../models/comment/createCommentModel";
import {UpdateCommentModel} from "../models/comment/updateCommentModel";
import {CommentType, CreateCommentDbType} from "../repositories/comments/commentSchema";
import {PostType} from "../repositories/posts/postSchema";
import {UserAccountType} from "../repositories/users/userSchema";
import {PostsRepository} from "../repositories/posts/postsRepository";
import {CommentsRepository} from "../repositories/comments/commentsRepository";
import {UsersRepository} from "../repositories/users/usersRepository";

export enum CommentError {
    Success,
    WrongUserError,
    NotFoundError
}

export class CommentsService {
    private postsRepository: PostsRepository
    private commentsRepository: CommentsRepository
    private usersRepository: UsersRepository

    constructor() {
        this.postsRepository = new PostsRepository();
        this.commentsRepository = new CommentsRepository();
        this.usersRepository = new UsersRepository();
    }

    async createComment(postId: string, userId: string, comment: CreateCommentModel): Promise<CommentType | CommentError> {
        const foundedPost: PostType | null  = await this.postsRepository.findPostById(postId);
        const foundedUser: UserAccountType | null = await this.usersRepository.findUserById(userId)
        if (!foundedPost || !foundedUser) return CommentError.NotFoundError;

        const newComment: CreateCommentDbType = {
            id: uuidv4(),
            postId: foundedPost.id,
            content: comment.content,
            userId: foundedUser.id,
            userLogin: foundedUser.accountData.login
        }

        return await this.commentsRepository.createComment(newComment);
    }
    async updateComment(id: string, userId: string, comment: UpdateCommentModel): Promise<CommentError> {
        const foundedComment: CommentType | null = await this.commentsRepository.findCommentById(id);
        if (foundedComment && foundedComment.userId !== userId) return CommentError.WrongUserError;

        const result: boolean = await this.commentsRepository.updateComment(id, comment);
        if (!result) return CommentError.NotFoundError;

        return CommentError.Success;
    }
    async deleteComment(id: string, userId: string): Promise<CommentError> {
        const foundedComment: CommentType | null = await this.commentsRepository.findCommentById(id);
        if (foundedComment && foundedComment.userId !== userId) return CommentError.WrongUserError;

        const result: boolean = await this.commentsRepository.deleteComment(id);
        if (!result) return CommentError.NotFoundError;

        return CommentError.Success;
    }
    async deleteAllComments() {
        return this.commentsRepository.deleteAllComments();
    }
}