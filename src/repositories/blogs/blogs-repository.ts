import {blogsCollection} from "../db";
import {BlogDbType, BlogType} from "../../types/blog-types";

export const blogsRepository = {
    async findBlogById(id: string): Promise<BlogType | null> {
        const dbBlog: BlogDbType | null = await blogsCollection.findOne({id: id});
        if (!dbBlog) return null;
        return this._mapBlogDBTypeToBlogType(dbBlog);
    },
    async createBlog(newBlog: BlogDbType): Promise<BlogType> {
        await blogsCollection.insertOne(newBlog);
        return this._mapBlogDBTypeToBlogType(newBlog);
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
    },
    _mapBlogDBTypeToBlogType(dbBlog: BlogDbType): BlogType {
        return {
            id: dbBlog.id,
            name: dbBlog.name,
            youtubeUrl: dbBlog.youtubeUrl,
            createdAt: dbBlog.createdAt
        }
    }
}