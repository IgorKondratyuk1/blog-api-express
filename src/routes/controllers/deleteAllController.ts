import {BlogsService} from "../../domain/blogsService";
import {PostsService} from "../../domain/postsService";
import {UsersService} from "../../domain/usersService";
import {CommentsService} from "../../domain/commentsService";
import {UsersActionsRepository} from "../../repositories/userActions/usersActionsRepository";
import {SecurityRepository} from "../../repositories/security/securityRepository";
import {Request, Response} from "express";
import {HTTP_STATUSES} from "../../index";

export class DeleteAllController {
    constructor(
        protected blogsService: BlogsService,
        protected postsService: PostsService,
        protected usersService: UsersService,
        protected commentsService: CommentsService,
        protected usersActionsRepository: UsersActionsRepository,
        protected securityRepository: SecurityRepository
    ) {
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