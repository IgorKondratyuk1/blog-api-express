import { v4 as uuidv4 } from 'uuid';
import {ObjectId} from "mongodb";
import {BlogDbType, BlogType} from "../types/blogTypes";
import {blogsRepository} from "../repositories/blogs/blogsRepository";

export const blogsService = {
    async createBlog(name: string, youtubeUrl: string): Promise<BlogType> {
        const newBlog: BlogDbType = {
            _id: new ObjectId(),
            id: uuidv4(),
            name,
            youtubeUrl,
            createdAt: (new Date()).toISOString()
        }

        return blogsRepository.createBlog(newBlog);
    },
    async updateBlog(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        return blogsRepository.updateBlog(id, name, youtubeUrl);
    },
    async deleteBlog(id: string): Promise<boolean> {
        return blogsRepository.deleteBlog(id);
    },
    async deleteAllBlogs() {
        return blogsRepository.deleteAllBlogs();
    }
}