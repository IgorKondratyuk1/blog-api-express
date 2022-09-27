import {BlogType} from "../types/types";
import {blogsCollection} from "./db";

export const blogsRepository = {
    async findAllBlogs(): Promise<BlogType[]> {
        return blogsCollection.find({}).toArray();
    },
    async findBlogById(id: string): Promise<BlogType | null> {
        return blogsCollection.findOne({id: id});
    },
    async createBlog(name: string, youtubeUrl: string): Promise<BlogType> {
        const newBlog: BlogType = {
            id: (+new Date()).toString(),
            name,
            youtubeUrl,
            createdAt: (new Date()).toISOString()
        }

        await blogsCollection.insertOne(newBlog);
        return newBlog;
    },
    async updateBlog(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        let result = await blogsCollection.updateOne({id: id}, { $set: { name, youtubeUrl }});
        return result.matchedCount === 1;
    },
    async deleteBlog(id: string): Promise<boolean> {
        let result = await blogsCollection.deleteOne({id: id});
        return result.deletedCount === 1;
    },
    async deleteAllBlogs() {
        return blogsCollection.deleteMany({});
    }
}