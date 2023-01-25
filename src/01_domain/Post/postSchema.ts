import mongoose, {Model} from "mongoose";
import {HydratedPost, PostDbMethodsType, PostDbType, PostType} from "./postTypes";
import {v4 as uuidv4} from "uuid";
import {CommentDbMethodsType, CommentDbType} from "../Comment/commentTypes";

type PostModel = Model<PostDbType, {}, PostDbMethodsType> & {
    createInstance(postTitle: string, postShortDescription: string,
                   postContent: string, blogId: string, blogName: string): Promise<HydratedPost>
}

export const postSchema = new mongoose.Schema<PostDbType>({
    id:	{ type: String, required: true },
    title: { type: String },
    shortDescription: { type: String },
    content: { type: String },
    blogId:	{ type: String, required: true },
    blogName: { type: String },
    extendedLikesInfo: {
        likesCount: {type: Number, default: 0, min: 0},
        dislikesCount: {type: Number, default: 0, min: 0}
    },
    createdAt: { type: Date },
    updatedAt: { type: Date }
},{timestamps: true, optimisticConcurrency: true});

postSchema.method("setLikesCount", async function setLikesCount(likesCount: number) {
    const post = this as PostDbType & PostDbMethodsType;
    if (likesCount < 0) throw new Error("LikesCount must be equal or greater than 0");
    post.extendedLikesInfo.likesCount = likesCount;
});

postSchema.method("setDislikesCount", async function setDislikesCount(dislikesCount: number) {
    const post = this as PostDbType & PostDbMethodsType;
    if (dislikesCount < 0) throw new Error("DislikesCount must be equal or greater than 0");
    post.extendedLikesInfo.dislikesCount = dislikesCount;
});

postSchema.method("updatePost", function updatePost(postBlogId: string, postContent: string, postTitle: string, postShortDescription: string) {
    const post = this as PostDbType & PostDbMethodsType;

    post.blogId = postBlogId;
    post.content = postContent;
    post.title = postTitle;
    post.shortDescription = postShortDescription;
});

postSchema.static("createInstance", async function createInstance(postTitle: string, postShortDescription: string,
                                                                        postContent: string, blogId: string, blogName: string) {
    const newPost = new Post({
        id: uuidv4(),
        title: postTitle,
        shortDescription: postShortDescription,
        content: postContent,
        blogId: blogId,
        blogName: blogName,
        extendedLikesInfo: {
            likesCount: 0,
            dislikesCount: 0
        }
    });
    return this.create(newPost);
})

export const Post = mongoose.model<PostDbType, PostModel>('Post', postSchema);