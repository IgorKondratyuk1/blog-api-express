import mongoose, {Model} from "mongoose";
import {BlogBbMethodsType, BlogDbType, HydratedBlog} from "./blogTypes";
import {v4 as uuidv4} from "uuid";

export type BlogModel = Model<BlogDbType, {}, BlogBbMethodsType> & {
    createInstance(name: string, websiteUrl: string, description: string): HydratedBlog
}

export const blogSchema = new mongoose.Schema<BlogDbType>({
    id: {type: String, required: true},
    name: {type: String},
    websiteUrl: {type: String, maxlength: 300},
    createdAt: {type: Date},
    updatedAt: {type: Date},
    description: {type: String, maxlength: 1000}
},{timestamps: true, optimisticConcurrency: true});

blogSchema.method("updateBlog", async function updateBlog(name: string, websiteUrl: string) {
    const blog = this as BlogDbType & BlogBbMethodsType;
    blog.name = name;
    blog.websiteUrl = websiteUrl
});

blogSchema.static("createInstance", async function createInstance(name: string, websiteUrl: string, description: string) {
    const newBlog = new Blog({
        id: uuidv4(),
        name,
        websiteUrl,
        description
    });

    return this.create(newBlog);
});

export const Blog = mongoose.model<BlogDbType, BlogModel>('Blog', blogSchema);