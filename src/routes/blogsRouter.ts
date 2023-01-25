import {Router} from "express";
import {container} from "../compositionRoot";
import {BlogsController} from "./controllers/blogsController";
import {queryValidation} from "../middlewares/validation/query/queryValidation";
import {basicAuthMiddleware} from "../middlewares/auth/basicAuthMiddleware";
import {blogValidation} from "../middlewares/validation/blogValidation";
import {postOfBlogValidation} from "../middlewares/validation/postOfBlogValidation";

const blogsController = container.resolve(BlogsController);

export const blogsRouter = Router();

blogsRouter.get("/",
    queryValidation,
    blogsController.getBlogs.bind(blogsController)
);

blogsRouter.get("/:id",
    blogsController.getBlog.bind(blogsController)
);

blogsRouter.post("/",
    basicAuthMiddleware,
    blogValidation,
    blogsController.createBlog.bind(blogsController)
);

blogsRouter.put("/:id",
    basicAuthMiddleware,
    blogValidation,
    blogsController.updateBlog.bind(blogsController)
);

blogsRouter.delete("/:id",
    basicAuthMiddleware,
    blogsController.deleteBlog.bind(blogsController)
);

blogsRouter.get("/:id/posts",
    queryValidation,
    blogsController.getPostsOfBlog.bind(blogsController)
);

blogsRouter.post("/:id/posts",
    basicAuthMiddleware,
    postOfBlogValidation,
    blogsController.createPostOfBlog.bind(blogsController)
);