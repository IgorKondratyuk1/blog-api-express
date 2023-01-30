import mongoose, {Model} from "mongoose";
import {CommentDbMethodsType, CommentDbType, HydratedComment} from "./commentTypes";
import {v4 as uuidv4} from "uuid";

type CommentModel = Model<CommentDbType, {}, CommentDbMethodsType> & {
    createInstance(postId: string, userId: string, userLogin: string, commentContent: string): Promise<HydratedComment>
}

export const commentSchema = new mongoose.Schema<CommentDbType>({
    id: {type: String, required: true},
    content: {type: String},
    userId: {type: String, required: true},
    userLogin: {type: String},
    createdAt: {type: Date},
    updatedAt: {type: Date},
    postId: {type: String, required: true},
    likesInfo: {
        likesCount: {type: Number, default: 0, min: 0},
        dislikesCount: {type: Number, default: 0, min: 0}
    }
}, {timestamps: true, optimisticConcurrency: true});

commentSchema.method("setLikesCount", async function setLikesCount(likesCount: number) {
    const comment = this as CommentDbType & CommentDbMethodsType;
    if (likesCount < 0) throw new Error("LikesCount must be equal or greater than 0");
    comment.likesInfo.likesCount = likesCount;
});

commentSchema.method("setDislikesCount", async function setDislikesCount(dislikesCount: number) {
    const comment = this as CommentDbType & CommentDbMethodsType;
    if (dislikesCount < 0) throw new Error("DislikesCount must be equal or greater than 0");
    comment.likesInfo.dislikesCount = dislikesCount;
});

commentSchema.static("createInstance", function createInstance(postId: string, userId: string, userLogin: string, commentContent: string) {
    const newComment = new Comment({
        id: uuidv4(),
        postId: postId,
        content: commentContent,
        userId: userId,
        userLogin: userLogin,
        likesInfo: {
            likesCount: 0,
            dislikesCount: 0
        }
    });

    return this.create(newComment);
});

export const Comment = mongoose.model<CommentDbType, CommentModel>('Comment', commentSchema);