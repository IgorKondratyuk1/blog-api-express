import {BlogType} from "../types/types";

export let blogs: BlogType[] = [
    {
        "id": "1",
        "name": "first-blog",
        "youtubeUrl": "url-1"
    },
    {
        "id": "2",
        "name": "second-blog",
        "youtubeUrl": "url-2"
    },
    {
        "id": "3",
        "name": "third-blog",
        "youtubeUrl": "url-3"
    }
];

export const blogsRepository = {
    findAllBlogs() {
        return blogs;
    },
    findBlogById(id: string) {
        const foundedBlog = blogs.find(b => b.id === id);
        return foundedBlog;
    },
    createBlog(name: string, youtubeUrl: string) {
        const newBlog = {
            id: (+new Date()).toString(),
            name,
            youtubeUrl
        }

        blogs.push(newBlog);
        return newBlog;
    },
    updateBlog(id: string, name: string, youtubeUrl: string) {
        let blog = blogs.find(p => p.id === id);
        if(blog) {
            blog.name = name;
            blog.youtubeUrl = youtubeUrl;
            return true;
        } else {
            return false;
        }
    },
    deleteBlog(id: string) {
        for (let i = 0; i < blogs.length; i++) {
            if (blogs[i].id === id) {
                blogs.splice(i,1);
                return true;
            }
        }

        return false;
    }
}