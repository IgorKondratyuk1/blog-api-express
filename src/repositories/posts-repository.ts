import {PostType} from "../types/types";
import {blogsCollection, postsCollection} from "./db";

export const postsRepository = {
    async findAllPosts(): Promise<PostType[]> {
        return postsCollection.find({}).toArray();
    },
    async findPostById(id: string): Promise<PostType | null> {
        return postsCollection.findOne({id: id});
    },
    async createPost(title: string, shortDescription: string,
               content: string, blogId: string) {

        const foundedBlog = await blogsCollection.findOne({id: blogId});
        if (!foundedBlog) {
            throw new Error("BlogId#'BlogId' is incorrect");
        }

        const newPost = {
            id: (+new Date()).toString(),
            title,
            shortDescription,
            content,
            blogId,
            blogName: foundedBlog.name,
            createdAt: (new Date()).toISOString()
        }

        postsCollection.insertOne(newPost);
        return newPost;
    },
    async updatePost(id: string, title: string, shortDescription: string,
               content: string, blogId: string): Promise<boolean> {

        const foundedBlog = await blogsCollection.findOne({id: blogId});
        if (!foundedBlog) {
            throw new Error("BlogId#'BlogId' is incorrect");
        }

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