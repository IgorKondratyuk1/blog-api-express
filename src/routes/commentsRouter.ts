import express from "express";
import {jwtAuthMiddleware} from "../middlewares/auth/jwtAuthMiddlewsre";
import {userIdentification} from "../middlewares/userIdentificationMiddleware";
import {container} from "../compositionRoot";
import {CommentsController} from "./controllers/commentsController";
import {commentValidation} from "../middlewares/validation/commentValidation";
import {likeValidation} from "../middlewares/validation/likeValidation";

const commentsController = container.resolve(CommentsController);

export const commentsRouter = express.Router();

commentsRouter.get("/:id",
    userIdentification,
    commentsController.getComment.bind(commentsController)
);

commentsRouter.put("/:id",
    jwtAuthMiddleware,
    commentValidation,
    commentsController.updateComment.bind(commentsController)
);

commentsRouter.delete("/:id",
    jwtAuthMiddleware,
    commentsController.deleteComment.bind(commentsController)
);

commentsRouter.put("/:id/like-status",
    jwtAuthMiddleware,
    likeValidation,
    commentsController.likeComment.bind(commentsController)
);
