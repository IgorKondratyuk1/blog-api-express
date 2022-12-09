import express, {Response} from "express";
import {HTTP_STATUSES} from "../index";
import {RequestWithParams, RequestWithParamsAndBody, TokensPair} from "../types/types";
import {UriParamsCommentModel} from "../models/comment/uriParamsCommentModel";
import {ViewCommentModel} from "../models/comment/viewCommentModel";
import {commentsQueryRepository} from "../repositories/comments/queryCommentsRepository";
import {commentValidationSchema} from "../middlewares/validation/commentValidationSchema";
import {jwtAuthMiddleware} from "../middlewares/auth/jwtAuthMiddlewsre";
import {UpdateCommentModel} from "../models/comment/updateCommentModel";
import {CommentError, commentsService} from "../domain/commentsService";

export const commentsRouter = express.Router();

commentsRouter.get("/:id",
    async (req: RequestWithParams<UriParamsCommentModel>, res: Response<ViewCommentModel>) => {
        const foundedComment: ViewCommentModel | null = await commentsQueryRepository.findCommentById(req.params.id);
        if (!foundedComment) { res.sendStatus(HTTP_STATUSES.NOT_FOUND_404); return; }

        res.json(foundedComment);
    });

commentsRouter.put("/:id",
    jwtAuthMiddleware,
    commentValidationSchema,
    async (req: RequestWithParamsAndBody<UriParamsCommentModel, UpdateCommentModel>, res: Response) => {
        const result: CommentError = await commentsService.updateComment(req.params.id, req.user!.id, req.body);

        switch (result) {
            case CommentError.WrongUserError: res.sendStatus(HTTP_STATUSES.FORBIDDEN_403); return;
            case CommentError.NotFoundError: res.sendStatus(HTTP_STATUSES.NOT_FOUND_404); return;
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204); return;
    });

commentsRouter.delete("/:id",
    jwtAuthMiddleware,
    async (req: RequestWithParams<UriParamsCommentModel>, res: Response<ViewCommentModel>) => {
        const result: CommentError = await commentsService.deleteComment(req.params.id, req.user!.id);
        switch (result) {
            case CommentError.WrongUserError: res.sendStatus(HTTP_STATUSES.FORBIDDEN_403); return;
            case CommentError.NotFoundError: res.sendStatus(HTTP_STATUSES.NOT_FOUND_404); return;
        }
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    });