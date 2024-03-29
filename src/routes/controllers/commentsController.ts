import {CommentError, CommentsService} from "../../application/commentsService";
import {RequestWithParams, RequestWithParamsAndBody} from "../../types/types";
import {UriParamsCommentModel} from "../../models/comment/uriParamsCommentModel";
import {Response} from "express";
import {ViewCommentModel} from "../../models/comment/viewCommentModel";
import {HTTP_STATUSES} from "../../index";
import {UpdateCommentModel} from "../../models/comment/updateCommentModel";
import {UpdateLikeModel} from "../../models/like/updateLikeModel";
import {LikeError, LikeService} from "../../application/likeService";
import {CommentsWithLikesQueryRepository} from "../../repositories/comments/queryCommentsWithLikesRepository";
import {inject, injectable} from "inversify";

@injectable()
export class CommentsController {
    constructor(
        @inject(CommentsWithLikesQueryRepository) protected commentsQueryRepository: CommentsWithLikesQueryRepository,
        @inject(CommentsService) protected commentsService: CommentsService,
        @inject(LikeService) protected likeService: LikeService
    ) {}

    async getComment(req: RequestWithParams<UriParamsCommentModel>, res: Response<ViewCommentModel>) {
        const foundedComment: ViewCommentModel | null = await this.commentsQueryRepository.findCommentById(req.params.id, req.userId);
        if (!foundedComment) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        res.json(foundedComment);
    }

    async updateComment(req: RequestWithParamsAndBody<UriParamsCommentModel, UpdateCommentModel>, res: Response) {
        const result: CommentError = await this.commentsService.updateComment(req.params.id, req.userId, req.body);

        switch (result) {
            case CommentError.WrongUserError:
                res.sendStatus(HTTP_STATUSES.FORBIDDEN_403);
                return;
            case CommentError.NotFoundError:
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
                return;
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        return;
    }

    async deleteComment(req: RequestWithParams<UriParamsCommentModel>, res: Response<ViewCommentModel>) {
        const result: CommentError = await this.commentsService.deleteComment(req.params.id, req.userId);
        switch (result) {
            case CommentError.WrongUserError:
                res.sendStatus(HTTP_STATUSES.FORBIDDEN_403);
                return;
            case CommentError.NotFoundError:
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
                return;
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }

    async likeComment(req: RequestWithParamsAndBody<UriParamsCommentModel, UpdateLikeModel>, res: Response) {
        const result: CommentError = await this.commentsService.likeComment(req.params.id, req.userId, req.userLogin, req.body.likeStatus);

        switch (result) {
            case CommentError.CreationError:
                res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
                return;
            case CommentError.NotFoundError:
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
                return;
            case CommentError.Success:
                break;
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        return;
    }
}