import {Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../index";
import {blogsService} from "../domain/blogsService";
import {postsService} from "../domain/postsService";
import {usersService} from "../domain/usersService";
import {commentsService} from "../domain/commentsService";
import {SETTINGS} from "../config";

export const deleteAllRouter = Router();

deleteAllRouter.delete("/all-data", async (req: Request, res: Response) => {
    await blogsService.deleteAllBlogs();
    await postsService.deleteAllPosts();
    await usersService.deleteAllUsers();
    await commentsService.deleteAllComments();
    //await usersActionsRepository.deleteAllActions();
    //await authService.deleteAllRefreshTokens();
    //await securityRepository.deleteAllDevices();
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

deleteAllRouter.get('/cookie', async (req: Request, res: Response) => {
    //console.log('Cookies: ', req.cookies);
    console.log(new Date());
    res.clearCookie('name1');
    res.cookie('name1', 'express1', {
        httpOnly: true,
        secure: false,
        maxAge: 20 * 1000
    });
    res.cookie('name2', 'express2')
    res.sendStatus(200);
});

deleteAllRouter.get('/envs', async (req: Request, res: Response) => {
    res.json(SETTINGS);
});