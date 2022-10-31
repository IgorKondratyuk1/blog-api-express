import {Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../index";
import {blogsService} from "../domain/blogs-service";
import {postsService} from "../domain/posts-service";
import {usersService} from "../domain/users-service";
import {commentsService} from "../domain/comments-service";
import {authService} from "../domain/auth-service";
import {add} from "date-fns";

export const testingRouter = Router();

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
    await blogsService.deleteAllBlogs();
    await postsService.deleteAllPosts();
    await usersService.deleteAllUsers();
    await commentsService.deleteAllComments();
    //await authService.deleteAllRefreshTokens();
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

testingRouter.get('/cookie', async (req: Request, res: Response) => {
    //console.log('Cookies: ', req.cookies);
    console.log(new Date());
    res.clearCookie('name1');
    res.cookie('name1', 'express1', {
        httpOnly: true,
        secure: true,
        maxAge: 20 * 1000
    });
    res.cookie('name2', 'express2')
    res.sendStatus(200);
});