import {blogsCollection} from "../db";
import {BlogDbType, BlogType} from "../../types/blogTypes";
import {mapBlogDBTypeToBlogType} from "../../helpers/mappers";

export const blogsRepository = {
    async findBlogById(id: string): Promise<BlogType | null> {
        const dbBlog: BlogDbType | null = await blogsCollection.findOne({id: id});
        if (!dbBlog) return null;
        return mapBlogDBTypeToBlogType(dbBlog);
    },
    async createBlog(newBlog: BlogDbType): Promise<BlogType> {
        await blogsCollection.insertOne(newBlog);
        return mapBlogDBTypeToBlogType(newBlog);
    },
    async updateBlog(id: string, name: string, websiteUrl: string): Promise<boolean> {
        let result = await blogsCollection.updateOne({id: id}, { $set: { name, websiteUrl }});
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