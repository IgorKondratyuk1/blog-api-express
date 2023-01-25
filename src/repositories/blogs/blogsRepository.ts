import {Blog} from "../../01_domain/Blog/blogSchema";
import {injectable} from "inversify";
import {HydratedBlog} from "../../01_domain/Blog/blogTypes";

@injectable()
export class BlogsRepository {
    async save(blog: HydratedBlog) {
        await blog.save();
    }
    async findBlogById(id: string): Promise<HydratedBlog | null> {
        try {
            const blog: HydratedBlog | null = await Blog.findOne({id});
            return blog;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async deleteBlog(id: string): Promise<boolean> {
        try {
            let result = await Blog.deleteOne({id});
            return result.deletedCount === 1;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async deleteAllBlogs() {
        try {
            return Blog.deleteMany({});
        } catch (error) {
            console.log(error);
        }
    }
}