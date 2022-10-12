import {v4 as uuidv4} from "uuid";
import {ObjectId} from "mongodb";
import {CommentDbType, CommentType} from "../types/comment-types";
import {UpdateCommentModel} from "../models/comment/update-comment-model";
import {postsRepository} from "../repositories/posts/posts-repository";
import {PostType} from "../types/post-types";
import {CreateCommentModel} from "../models/comment/create-comment-model";
import {usersRepository} from "../repositories/users/users-repository";
import {UserType} from "../types/user-types";
import {commentsRepository} from "../repositories/comments/comments-repository";

export const commentsService = {
    async createComment(postId: string, userId: string, comment: CreateCommentModel): Promise<CommentType> {
        const foundedPost: PostType | null  = await postsRepository.findPostById(postId);
        const foundedUser: UserType | null = await usersRepository.findUserById(userId)
        console.log(foundedUser);
        if (!foundedPost) throw new Error("'PostId' is incorrect");
        if (!foundedUser) throw new Error("'UserLogin' is incorrect");

        const newComment: CommentDbType = {
            _id: new ObjectId(),
            id: uuidv4(),
            postId: foundedPost.id,
            content: comment.content,
            userId: foundedUser.id,
            userLogin: foundedUser.login,
            createdAt: (new Date()).toISOString()
        }

        return commentsRepository.createComment(newComment);
    },
    async updateComment(id: string, userId: string, comment: UpdateCommentModel): Promise<boolean> {
        const foundedComment: CommentType | null = await commentsRepository.findCommentById(id);

        if (foundedComment && foundedComment.userId !== userId) {
            throw Error('Change comment of other user is forbidden');
        }

        return await commentsRepository.updateComment(id, comment);
    },
    async deleteComment(id: string, userId: string): Promise<boolean> {
        const foundedComment: CommentType | null = await commentsRepository.findCommentById(id);

        if (foundedComment && foundedComment.userId !== userId) {
            throw Error('Delete comment of other user is forbidden');
        }

        return commentsRepository.deleteComment(id);
    },
    async deleteAllComments() {
        return commentsRepository.deleteAllComments();
    }
}