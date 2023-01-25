import {Router} from "express";
import {basicAuthMiddleware} from "../middlewares/auth/basicAuthMiddleware";
import {jwtAuthMiddleware} from "../middlewares/auth/jwtAuthMiddlewsre";
import {userIdentification} from "../middlewares/userIdentificationMiddleware";
import {container} from "../compositionRoot";
import {PostsController} from "./controllers/postsController";
import {queryValidation} from "../middlewares/validation/query/queryValidation";
import {postValidation} from "../middlewares/validation/postValidation";
import {commentValidation} from "../middlewares/validation/commentValidation";
import {likeValidation} from "../middlewares/validation/likeValidation";

const postsController = container.resolve(PostsController);

export const postsRouter = Router();

postsRouter.get("/",
    userIdentification,
    queryValidation,
    postsController.getPosts.bind(postsController)
);

postsRouter.get("/:id",
    userIdentification,
    postsController.getPost.bind(postsController)
);

postsRouter.post("/",
    basicAuthMiddleware,
    postValidation,
    postsController.createPost.bind(postsController)
);

postsRouter.put("/:id",
    basicAuthMiddleware,
    postValidation,
    postsController.updatePost.bind(postsController)
);

postsRouter.delete("/:id",
    basicAuthMiddleware,
    postsController.deletePost.bind(postsController)
);

postsRouter.get("/:id/comments",
    userIdentification,
    postsController.getCommentsOfPost.bind(postsController)
);

postsRouter.post("/:id/comments",
    jwtAuthMiddleware,
    commentValidation,
    postsController.createCommentOfPost.bind(postsController)
);

postsRouter.put("/:id/like-status",
    jwtAuthMiddleware,
    likeValidation,
    postsController.likePost.bind(postsController)
);
