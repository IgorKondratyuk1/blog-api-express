import { v4 as uuidv4 } from 'uuid';
import {blogsRepository} from "../repositories/blogs/blogsRepository";
import {BlogType, CreateBlogDbType} from "../repositories/blogs/blogSchema";

export const blogsService = {
    async createBlog(name: string, websiteUrl: string, description: string): Promise<BlogType> {
        const newBlog: CreateBlogDbType = {
            id: uuidv4(),
            name,
            websiteUrl,
            description
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