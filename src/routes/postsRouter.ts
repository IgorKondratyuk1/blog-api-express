import {Router} from "express";
import {queryValidationSchema} from "../middlewares/validation/query/queryValidationSchema";
import {basicAuthMiddleware} from "../middlewares/auth/basicAuthMiddleware";
import {postValidationSchema} from "../middlewares/validation/postValidationSchema";
import {jwtAuthMiddleware} from "../middlewares/auth/jwtAuthMiddlewsre";
import {commentValidationSchema} from "../middlewares/validation/commentValidationSchema";
import {PostsController} from "./controllers/postsController";
import {postsController} from "../compositionRoot";

export const postsRouter = Router();

postsRouter.get("/",
    queryValidationSchema,
    postsController.getPosts.bind(postsController)
);

postsRouter.get("/:id",
    postsController.getPost.bind(postsController)
);

postsRouter.post("/",
    basicAuthMiddleware,
    postValidationSchema,
    postsController.createPost.bind(postsController)
);

postsRouter.put("/:id",
    basicAuthMiddleware,
    postValidationSchema,
    postsController.updatePost.bind(postsController)
);

postsRouter.delete("/:id",
    basicAuthMiddleware,
    postsController.deletePost.bind(postsController)
);

postsRouter.get("/:id/comments",
    jwtAuthMiddleware,
    postsController.getCommentsOfPost.bind(postsController)
);

postsRouter.post("/:id/comments",
    jwtAuthMiddleware,
    commentValidationSchema,
    postsController.createCommentOfPost.bind(postsController)
);