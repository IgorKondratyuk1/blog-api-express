import {Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../index";
import {SETTINGS} from "../config";
import {BlogsService} from "../domain/blogsService";
import {PostsService} from "../domain/postsService";
import {UsersService} from "../domain/usersService";
import {CommentsService} from "../domain/commentsService";
import {UsersActionsRepository} from "../repositories/userActions/usersActionsRepository";
import {SecurityRepository} from "../repositories/security/securityRepository";

export const deleteAllRouter = Router();

class DeleteAllController {
    private blogsService: BlogsService;
    private postsService: PostsService;
    private usersService: UsersService;
    private commentsService: CommentsService;
    private usersActionsRepository: UsersActionsRepository;
    private securityRepository: SecurityRepository;

    constructor() {
        this.blogsService = new BlogsService();
        this.postsService = new PostsService();
        this.usersService = new UsersService();
        this.commentsService = new CommentsService();
        this.usersActionsRepository = new UsersActionsRepository();
        this.securityRepository = new SecurityRepository();
    }

    async delete(req: Request, res: Response) {
        await this.blogsService.deleteAllBlogs();
        await this.postsService.deleteAllPosts();
        await this.usersService.deleteAllUsers();
        await this.commentsService.deleteAllComments();
        await this.usersActionsRepository.deleteAllActions();
        await this.securityRepository.deleteAllDevices();
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }
}

const deleteAllController = new DeleteAllController();

deleteAllRouter.delete("/all-data", deleteAllController.delete.bind(deleteAllController));

// Test routes
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