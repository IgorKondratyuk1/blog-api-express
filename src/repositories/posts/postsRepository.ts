import {postsCollection} from "../db";
import {PostDbType, PostType} from "../../types/postTypes";
import {UpdatePostModel} from "../../models/post/updatePostModel";
import {mapPostDbTypeToPostType} from "../../helpers/mappers";


export const postsRepository = {
    async findPostById(id: string): Promise<PostType | null> {
        const dbPost: PostDbType | null = await postsCollection.findOne({id: id});
        if (!dbPost) return null;
        return mapPostDbTypeToPostType(dbPost);
    },
    async createPost(newPost: PostDbType): Promise<PostType> {
        await postsCollection.insertOne(newPost);
        return mapPostDbTypeToPostType(newPost);
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