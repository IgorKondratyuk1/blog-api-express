import {Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../index";
import {blogsService} from "../domain/blogs-service";
import {postsService} from "../domain/posts-service";

export const testingRouter = Router();

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
    await blogsService.deleteAllBlogs();
    await postsService.deleteAllPosts();
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});