import {UpdateCommentModel} from "../../models/comment/updateCommentModel";
import {mapCommentDbTypeToCommentType} from "../../helpers/mappers";
import {DeleteResult} from "mongodb";
import {injectable} from "inversify";
import {CommentDbType, CommentType, HydratedComment} from "../../01_domain/Comment/commentTypes";
import {Comment} from "../../01_domain/Comment/commentSchema";
import {HydratedUser} from "../../01_domain/User/UserTypes";

@injectable()
export class CommentsRepository {
    async save(comment: HydratedComment) {
        await comment.save();
    }
    async findCommentById(id: string): Promise<HydratedComment | null> {
        const comment: HydratedComment | null = await Comment.findOne({id});
        return comment;
    }



    async updateLikesCount(id: string, newCount: number): Promise<boolean> {
        try {
            const comment = await Comment.findOne({id});
            if (!comment) return false;

            comment.likesInfo.likesCount = newCount;
            await comment.save();

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateDislikesCount(id: string, newCount: number): Promise<boolean> {
        try {
            const comment = await Comment.findOne({id});
            if (!comment) return false;

            comment.likesInfo.dislikesCount = newCount;
            await comment.save();

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async deleteComment(id: string): Promise<boolean> {
        const result: DeleteResult = await Comment.deleteOne({id});
        return result.deletedCount === 1;
    }

    async deleteAllComments() {
        return Comment.deleteMany({});
    }
}