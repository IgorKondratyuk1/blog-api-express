import {postsCollection} from "../db";
import {UpdatePostModel} from "../../models/post/update-post-model";
import {PostDbType, PostType} from "../../types/post-types";

export const postsRepository = {
    async findPostById(id: string): Promise<PostType | null> {
        const dbPost: PostDbType | null = await postsCollection.findOne({id: id});
        if (!dbPost) return null;
        return this._mapPostDbTypeToPostType(dbPost);
    },
    async createPost(newPost: PostDbType): Promise<PostType> {
        await postsCollection.insertOne(newPost);
        return this._mapPostDbTypeToPostType(newPost);
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
    },
    _mapPostDbTypeToPostType(dbPost: PostDbType): PostType {
        return {
            id: dbPost.id,
            blogId: dbPost.blogId,
            content: dbPost.content,
            createdAt: dbPost.createdAt,
            shortDescription: dbPost.shortDescription,
            title: dbPost.title,
            blogName: dbPost.blogName
        }
    }
}