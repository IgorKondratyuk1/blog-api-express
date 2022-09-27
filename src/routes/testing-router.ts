import {Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../index";
import {blogsRepository} from "../repositories/blogs-repository";
import {postsRepository} from "../repositories/posts-repository";

export const testingRouter = Router();

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
    await blogsRepository.deleteAllBlogs();
    await postsRepository.deleteAllPosts();
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});