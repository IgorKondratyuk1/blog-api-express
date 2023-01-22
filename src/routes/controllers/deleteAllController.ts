import {BlogsService} from "../../domain/blogsService";
import {PostsService} from "../../domain/postsService";
import {UsersService} from "../../domain/usersService";
import {CommentsService} from "../../domain/commentsService";
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
        await this.securityRepository.deleteAllDevices();
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }
}