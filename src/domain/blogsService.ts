import { v4 as uuidv4 } from 'uuid';
import {BlogType, CreateBlogDbType} from "../repositories/blogs/blogSchema";
import {BlogsRepository} from "../repositories/blogs/blogsRepository";
import {inject, injectable} from "inversify";

@injectable()
export class BlogsService {
    constructor(
        @inject(BlogsRepository) protected blogsRepository: BlogsRepository
    ) {}

    async createBlog(name: string, websiteUrl: string, description: string): Promise<BlogType | null> {
        const newBlog: CreateBlogDbType = {
            id: uuidv4(),
            name,
            websiteUrl,
            description
        }

        return this.blogsRepository.createBlog(newBlog);
    }
    async updateBlog(id: string, name: string, websiteUrl: string): Promise<boolean> {
        return this.blogsRepository.updateBlog(id, name, websiteUrl);
    }
    async deleteBlog(id: string): Promise<boolean> {
        return this.blogsRepository.deleteBlog(id);
    }
    async deleteAllBlogs() {
        return this.blogsRepository.deleteAllBlogs();
    }
}