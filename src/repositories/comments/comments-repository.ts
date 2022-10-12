import {commentsCollection} from "../db";
import {CommentDbType, CommentType} from "../../types/comment-types";
import {UpdateCommentModel} from "../../models/comment/update-comment-model";

export const commentsRepository = {
    async findCommentById(id: string): Promise<CommentType | null> {
        const dbComment: CommentDbType | null = await commentsCollection.findOne({id: id});
        if (!dbComment) return null;
        return this._mapCommentDbTypeToCommentType(dbComment);
    },
    async createComment(newComment: CommentDbType): Promise<CommentType> {
        await commentsCollection.insertOne(newComment);
        return this._mapCommentDbTypeToCommentType(newComment);
    },
    async updateComment(id: string, comment: UpdateCommentModel): Promise<boolean> {
        const result = await commentsCollection.updateOne({id: id}, { $set: { content: comment.content }});
        return result.matchedCount === 1;
    },
    async deleteComment(id: string): Promise<boolean> {
        const result = await commentsCollection.deleteOne({ id: id });
        return result.deletedCount === 1;
    },
    async deleteAllComments() {
        return commentsCollection.deleteMany({});
    },
    _mapCommentDbTypeToCommentType(dbComment: CommentDbType): CommentType {
        return {
            id: dbComment.id,
            content: dbComment.content,
            createdAt: dbComment.createdAt,
            userId: dbComment.userId,
            userLogin: dbComment.userLogin
        }
    }
}