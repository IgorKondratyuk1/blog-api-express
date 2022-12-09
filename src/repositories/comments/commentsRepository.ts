import {UpdateCommentModel} from "../../models/comment/updateCommentModel";
import {mapCommentDbTypeToCommentType} from "../../helpers/mappers";
import {CommentModel, CommentDbType, CommentType, CreateCommentDbType} from "./commentSchema";
import {DeleteResult} from "mongodb";

export const commentsRepository = {
    async findCommentById(id: string): Promise<CommentType | null> {
        const dbComment: CommentDbType | null = await CommentModel.findOne({id});
        if (!dbComment) return null;
        return mapCommentDbTypeToCommentType(dbComment);
    },
    async createComment(newComment: CreateCommentDbType): Promise<CommentType> {
        const comment = new CommentModel(newComment);
        const createdComment: CommentDbType = await comment.save();
        return mapCommentDbTypeToCommentType(createdComment);
    },
    async updateComment(id: string, newComment: UpdateCommentModel): Promise<boolean> {
        try {
            const comment = await CommentModel.findOne({id});
            if (!comment) return false;

            comment.content = newComment.content;
            await comment.save();

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }

    },
    async deleteComment(id: string): Promise<boolean> {
        const result: DeleteResult = await CommentModel.deleteOne({ id});
        return result.deletedCount === 1;
    },
    async deleteAllComments() {
        return CommentModel.deleteMany({});
    }
}