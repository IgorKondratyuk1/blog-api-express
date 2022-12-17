import express, {Response} from "express";
import {HTTP_STATUSES} from "../index";
import {RequestWithParams, RequestWithParamsAndBody, TokensPair} from "../types/types";
import {UriParamsCommentModel} from "../models/comment/uriParamsCommentModel";
import {ViewCommentModel} from "../models/comment/viewCommentModel";
import {commentValidationSchema} from "../middlewares/validation/commentValidationSchema";
import {jwtAuthMiddleware} from "../middlewares/auth/jwtAuthMiddlewsre";
import {UpdateCommentModel} from "../models/comment/updateCommentModel";
import {CommentError, CommentsService} from "../domain/commentsService";
import {CommentsQueryRepository} from "../repositories/comments/queryCommentsRepository";

export const commentsRouter = express.Router();

class CommentsController {
    private commentsQueryRepository: CommentsQueryRepository;
    private commentsService: CommentsService;
    
    constructor() {
        this.commentsQueryRepository = new CommentsQueryRepository();
        this.commentsService = new CommentsService();
    }
    
    async getComment(req: RequestWithParams<UriParamsCommentModel>, res: Response<ViewCommentModel>) {
        const foundedComment: ViewCommentModel | null = await this.commentsQueryRepository.findCommentById(req.params.id);
        if (!foundedComment) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        res.json(foundedComment);
    }

    async updateComment(req: RequestWithParamsAndBody<UriParamsCommentModel, UpdateCommentModel>, res: Response) {
        const result: CommentError = await this.commentsService.updateComment(req.params.id, req.user!.id, req.body);

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
        const result: CommentError = await this.commentsService.deleteComment(req.params.id, req.user!.id);
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
}

const commentsController = new CommentsController();

commentsRouter.get("/:id",
    commentsController.getComment.bind(commentsController)
);

commentsRouter.put("/:id",
    jwtAuthMiddleware,
    commentValidationSchema,
    commentsController.updateComment.bind(commentsController)
);

commentsRouter.delete("/:id",
    jwtAuthMiddleware,
    commentsController.deleteComment.bind(commentsController)
);