import {Request, Response, Router} from "express";
import {blogs} from "../repositories/blogs-repository";
import {posts} from "../repositories/posts-repository";
import {HTTP_STATUSES} from "../index";

export const testingRouter = Router();

testingRouter.delete("/all-data", (req: Request, res: Response) => {
    const arrBlogsLength = blogs.length;
    for(let i = 0; i < arrBlogsLength; i++) {
        blogs.pop();
    }

    const arrPostsLength = posts.length;
    for(let i = 0; i < arrPostsLength; i++) {
        posts.pop();
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});