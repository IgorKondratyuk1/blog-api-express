import {Router} from "express";
import {queryValidationSchema} from "../middlewares/validation/query/queryValidationSchema";
import {basicAuthMiddleware} from "../middlewares/auth/basicAuthMiddleware";
import {blogValidationSchema} from "../middlewares/validation/blogValidationSchema";
import {postOfBlogValidationSchema} from "../middlewares/validation/postOfBlogValidationSchema";
import {blogsController} from "../compositionRoot";

export const blogsRouter = Router();

blogsRouter.get("/",
    queryValidationSchema,
    blogsController.getBlogs.bind(blogsController)
);

blogsRouter.get("/:id",
    blogsController.getBlog.bind(blogsController)
);

blogsRouter.post("/",
    basicAuthMiddleware,
    blogValidationSchema,
    blogsController.createBlog.bind(blogsController)
);

blogsRouter.put("/:id",
    basicAuthMiddleware,
    blogValidationSchema,
    blogsController.updateBlog.bind(blogsController)
);

blogsRouter.delete("/:id",
    basicAuthMiddleware,
    blogsController.deleteBlog.bind(blogsController)
);

blogsRouter.get("/:id/posts",
    queryValidationSchema,
    blogsController.getPostsOfBlog.bind(blogsController)
);

blogsRouter.post("/:id/posts",
    basicAuthMiddleware,
    postOfBlogValidationSchema,
    blogsController.createPostOfBlog.bind(blogsController)
);