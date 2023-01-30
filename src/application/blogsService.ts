import {Blog} from "../domain/Blog/blogSchema";
import {BlogsRepository} from "../repositories/blogs/blogsRepository";
import {inject, injectable} from "inversify";
import {HydratedBlog} from "../domain/Blog/blogTypes";

@injectable()
export class BlogsService {
    constructor(
        @inject(BlogsRepository) protected blogsRepository: BlogsRepository
    ) {}
    async createBlog(name: string, websiteUrl: string, description: string): Promise<HydratedBlog | null> {
        const blog: HydratedBlog = Blog.createInstance(name,websiteUrl,description);
        return blog;
    }
    async updateBlog(id: string, name: string, websiteUrl: string): Promise<boolean> {
        const blog: HydratedBlog | null = await this.blogsRepository.findBlogById(id);
        if (!blog) return false;

        await blog.updateBlog(name, websiteUrl);
        await this.blogsRepository.save(blog);

        return true;
    }
    async deleteBlog(id: string): Promise<boolean> {
        return this.blogsRepository.deleteBlog(id);
    }
    async deleteAllBlogs() {
        return this.blogsRepository.deleteAllBlogs();
    }
}