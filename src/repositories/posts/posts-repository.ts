import {PostType} from "../../types/types";
import {postsCollection} from "../db";
import {UpdatePostModel} from "../../models/post/update-post-model";

export const postsRepository = {
    async findPostById(id: string): Promise<PostType | null> {
        return postsCollection.findOne({id: id});
    },
    async createPost(newPost: PostType): Promise<PostType> {
        await postsCollection.insertOne(newPost);
        return newPost;
    },
    async updatePost(id: string, post: UpdatePostModel): Promise<boolean> {
        const {title, shortDescription, content, blogId} = post;
        const result = await postsCollection.updateOne({id: id}, { $set: { title, shortDescription, content, blogId }});
        return result.matchedCount === 1;
    },
    async deletePost(id: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({ id: id });
        return result.deletedCount === 1;
    },
    async deleteAllPosts() {
        return postsCollection.deleteMany({});
    }
}