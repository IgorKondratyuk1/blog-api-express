import express from "express";
import {commentValidationSchema} from "../middlewares/validation/commentValidationSchema";
import {jwtAuthMiddleware} from "../middlewares/auth/jwtAuthMiddlewsre";
import {commentsController} from "../compositionRoot";
import {likeValidationSchema} from "../middlewares/validation/likeValidationSchema";

export const commentsRouter = express.Router();

commentsRouter.get("/:id",
    jwtAuthMiddleware,
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

commentsRouter.put("/:id/like-status",
    jwtAuthMiddleware,
    likeValidationSchema,
    commentsController.likeComment.bind(commentsController)
);
