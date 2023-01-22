import {mapBlogDBTypeToBlogType} from "../../helpers/mappers";
import {BlogDbType, BlogModel, BlogType, CreateBlogDbType} from "./blogSchema";
import {injectable} from "inversify";

@injectable()
export class BlogsRepository {
    async findBlogById(id: string): Promise<BlogType | null> {
        try {
            const dbBlog: BlogDbType | null = await BlogModel.findOne({id});
            if (!dbBlog) return null;
            return mapBlogDBTypeToBlogType(dbBlog);
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async createBlog(newBlog: CreateBlogDbType): Promise<BlogType | null> {
        try {
            const blog = new BlogModel(newBlog);
            const createdBlog: BlogDbType = await blog.save();
            return mapBlogDBTypeToBlogType(createdBlog);
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async updateBlog(id: string, name: string, websiteUrl: string): Promise<boolean> {
        try {
            const blog = await BlogModel.findOne({id});
            if (!blog) return false;

            blog.name = name;
            blog.websiteUrl = websiteUrl;
            await blog.save();

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async deleteBlog(id: string): Promise<boolean> {
        try {
            let result = await BlogModel.deleteOne({id});
            return result.deletedCount === 1;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async deleteAllBlogs() {
        try {
            return BlogModel.deleteMany({});
        } catch (error) {
            console.log(error);
        }
    }
}