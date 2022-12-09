import {mapBlogDBTypeToBlogType} from "../../helpers/mappers";
import {BlogDbType, BlogModel, BlogType, CreateBlogDbType} from "./blogSchema";

export const blogsRepository = {
    async findBlogById(id: string): Promise<BlogType | null> {
        const dbBlog: BlogDbType | null = await BlogModel.findOne({id});
        if (!dbBlog) return null;
        return mapBlogDBTypeToBlogType(dbBlog);
    },
    async createBlog(newBlog: CreateBlogDbType): Promise<BlogType> {
        const blog = new BlogModel(newBlog);
        const createdBlog: BlogDbType = await blog.save();
        return mapBlogDBTypeToBlogType(createdBlog);
    },
    async updateBlog(id: string, name: string, websiteUrl: string): Promise<boolean> {
        const blog = await BlogModel.findOne({id});
        if (!blog) return false;

        blog.name = name;
        blog.websiteUrl = websiteUrl;
        await blog.save();

        return true;
    },
    async deleteBlog(id: string): Promise<boolean> {
        let result = await BlogModel.deleteOne({id});
        return result.deletedCount === 1;
    },
    async deleteAllBlogs() {
        return BlogModel.deleteMany({});
    }
}