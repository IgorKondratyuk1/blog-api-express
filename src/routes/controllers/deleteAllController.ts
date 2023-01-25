import {BlogsService} from "../../02_application/blogsService";
import {PostsService} from "../../02_application/postsService";
import {UsersService} from "../../02_application/usersService";
import {CommentsService} from "../../02_application/commentsService";
import {UsersActionsRepository} from "../../repositories/userActions/usersActionsRepository";
import {SecurityRepository} from "../../repositories/security/securityRepository";
import {Request, Response} from "express";
import {HTTP_STATUSES} from "../../index";
import {inject, injectable} from "inversify";

@injectable()
export class DeleteAllController {
    constructor(
        @inject(BlogsService) protected blogsService: BlogsService,
        @inject(PostsService) protected postsService: PostsService,
        @inject(UsersService) protected usersService: UsersService,
        @inject(CommentsService) protected commentsService: CommentsService,
        @inject(UsersActionsRepository) protected usersActionsRepository: UsersActionsRepository,
        @inject(SecurityRepository) protected securityRepository: SecurityRepository
    ) {}

    async delete(req: Request, res: Response) {
        await this.blogsService.deleteAllBlogs();
        await this.postsService.deleteAllPosts();
        await this.usersService.deleteAllUsers();
        await this.commentsService.deleteAllComments();
        await this.usersActionsRepository.deleteAllActions();
        await this.securityRepository.deleteAllSessions();
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }
}