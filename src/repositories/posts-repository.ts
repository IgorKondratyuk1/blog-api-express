import {PostType} from "../types/types";
import {blogsRepository} from "./blogs-repository";

export let posts: PostType[] = [];

export const postsRepository = {
    findAllPosts() {
        return posts;
    },
    findPostById(id: string) {
        const foundedPost = posts.find(p => p.id === id);
        return foundedPost;
    },
    createPost(title: string, shortDescription: string,
               content: string, blogId: string) {

        const foundedBlog = blogsRepository.findBlogById(blogId);
        if (!foundedBlog) {
            throw new Error("BlogId#'BlogId' is incorrect");
        }

        const newPost = {
            id: (+new Date()).toString(),
            title,
            shortDescription,
            content,
            blogId,
            blogName: foundedBlog.name
        }

        posts.push(newPost);
        return newPost;

    },
    updatePost(id: string, title: string, shortDescription: string,
               content: string, blogId: string) {
        let post = posts.find(p => p.id === id);

        const foundedBlog = blogsRepository.findBlogById(blogId);
        if (!foundedBlog) {
            throw new Error("BlogId#'BlogId' is incorrect");
        }

        if(post) {
            post.title = title;
            post.shortDescription = shortDescription;
            post.content = content;
            post.blogId = blogId;
            return true;
        } else {
            return false;
        }
    },
    deletePost(id: string) {
        for (let i = 0; i < posts.length; i++) {
            if (posts[i].id === id) {
                posts.splice(i,1);
                return true;
            }
        }

        return false;
    }
}