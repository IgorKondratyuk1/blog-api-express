import {Router} from "express";
import {queryValidationSchema} from "../middlewares/validation/query/queryValidationSchema";
import {basicAuthMiddleware} from "../middlewares/auth/basicAuthMiddleware";
import {postValidationSchema} from "../middlewares/validation/postValidationSchema";
import {jwtAuthMiddleware} from "../middlewares/auth/jwtAuthMiddlewsre";
import {commentValidationSchema} from "../middlewares/validation/commentValidationSchema";
import {userIdentification} from "../middlewares/userIdentificationMiddleware";
import {container} from "../compositionRoot";
import {PostsController} from "./controllers/postsController";

const postsController = container.resolve(PostsController);

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
    userIdentification,
    postsController.getCommentsOfPost.bind(postsController)
);

postsRouter.post("/:id/comments",
    jwtAuthMiddleware,
    commentValidationSchema,
    postsController.createCommentOfPost.bind(postsController)
);