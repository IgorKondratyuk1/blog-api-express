import express, {Response} from "express";
import {HTTP_STATUSES} from "../index";
import {RequestWithParams, RequestWithParamsAndBody} from "../types/types";
import {UriParamsCommentModel} from "../models/comment/uriParamsCommentModel";
import {ViewCommentModel} from "../models/comment/viewCommentModel";
import {commentsQueryRepository} from "../repositories/comments/queryCommentsRepository";
import {commentValidationSchema} from "../schemas/commentValidationSchema";
import {jwtAuthMiddleware} from "../middlewares/jwtAuthMiddlewsre";
import {UpdateCommentModel} from "../models/comment/updateCommentModel";
import {commentsService} from "../domain/commentsService";

export const commentsRouter = express.Router();

commentsRouter.get("/:id",
    async (req: RequestWithParams<UriParamsCommentModel>, res: Response<ViewCommentModel>) => {

    const foundedComment: ViewCommentModel | null = await commentsQueryRepository.findCommentById(req.params.id);

    if (!foundedComment) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }

    res.json(foundedComment);
});

commentsRouter.put("/:id",
    jwtAuthMiddleware,
    commentValidationSchema,
    async (req: RequestWithParamsAndBody<UriParamsCommentModel, UpdateCommentModel>, res: Response) => {

    try {
        const isCommentUpdated: boolean = await commentsService.updateComment(req.params.id, req.user!.id, req.body);

        if(!isCommentUpdated) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        } else {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(HTTP_STATUSES.FORBIDDEN_403);
    }
});

commentsRouter.delete("/:id",
    jwtAuthMiddleware,
    async (req: RequestWithParams<UriParamsCommentModel>, res: Response<ViewCommentModel>) => {

    try {
        const isCommentDeleted: boolean = await commentsService.deleteComment(req.params.id, req.user!.id);

        if(!isCommentDeleted) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        } else {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(HTTP_STATUSES.FORBIDDEN_403);
    }
});