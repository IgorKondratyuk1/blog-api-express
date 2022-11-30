import { v4 as uuidv4 } from 'uuid';
import {ObjectId} from "mongodb";
import {BlogDbType, BlogType} from "../types/blogTypes";
import {blogsRepository} from "../repositories/blogs/blogsRepository";

export const blogsService = {
    async createBlog(name: string, websiteUrl: string, description: string): Promise<BlogType> {
        const newBlog: BlogDbType = {
            _id: new ObjectId(),
            id: uuidv4(),
            name,
            websiteUrl,
            description,
            createdAt: (new Date()).toISOString()
        }

        return blogsRepository.createBlog(newBlog);
    },
    async updateBlog(id: string, name: string, websiteUrl: string): Promise<boolean> {
        return blogsRepository.updateBlog(id, name, websiteUrl);
    },
    async deleteBlog(id: string): Promise<boolean> {
        return blogsRepository.deleteBlog(id);
    },
    async deleteAllBlogs() {
        return blogsRepository.deleteAllBlogs();
    }
}