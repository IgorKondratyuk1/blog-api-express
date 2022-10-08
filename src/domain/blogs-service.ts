import { v4 as uuidv4 } from 'uuid';
import {blogsRepository} from "../repositories/blogs/blogs-repository";
import {BlogType} from "../types/types";

export const blogsService = {
    async createBlog(name: string, youtubeUrl: string): Promise<BlogType> {
        const newBlog: BlogType = {
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