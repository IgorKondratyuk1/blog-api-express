import {blogsRepository} from "../repositories/blogs/blogs-repository";
import {BlogType, PostType} from "../types/types";

export const blogsService = {
    async createBlog(name: string, youtubeUrl: string): Promise<BlogType> {
        const newBlog: BlogType = {
            id: (+new Date()).toString(),
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