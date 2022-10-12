import {Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../index";
import {blogsService} from "../domain/blogs-service";
import {postsService} from "../domain/posts-service";
import {usersService} from "../domain/users-service";
import {commentsService} from "../domain/comments-service";

export const testingRouter = Router();

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
    await blogsService.deleteAllBlogs();
    await postsService.deleteAllPosts();
    await usersService.deleteAllUsers();
    await commentsService.deleteAllComments();
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});