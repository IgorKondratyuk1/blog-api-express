import {Response, Router} from "express";
import {
    Paginator,
    RequestWithBody,
    RequestWithParamsAndBody,
    RequestWithParams, RequestWithParamsAndQuery,
    RequestWithQuery
} from "../types/types";
import {queryValidationSchema} from "../middlewares/validation/query/queryValidationSchema";
import {BlogQueryModel} from "../models/blog/blogQueryModel";
import {ViewBlogModel} from "../models/blog/viewBlogModel";
import {blogsQueryRepository} from "../repositories/blogs/queryBlogRepository";
import {UriParamsBlogModel} from "../models/blog/uriParamsBlogModel";
import {HTTP_STATUSES} from "../index";
import {basicAuthMiddleware} from "../middlewares/auth/basicAuthMiddleware";
import {blogValidationSchema} from "../middlewares/validation/blogValidationSchema";
import {mapBlogTypeToBlogViewModel, mapPostTypeToPostViewModel} from "../helpers/mappers";
import {CreateBlogModel} from "../models/blog/createBlogModel";
import {blogsService} from "../domain/blogsService";
import {UpdateBlogModel} from "../models/blog/updateBlogModel";
import {QueryPostModel} from "../models/post/queryPostModel";
import {ViewPostModel} from "../models/post/viewPostModel";
import {CreatePostOfBlogModel} from "../models/post/createPostOfBlog";
import {postsService} from "../domain/postsService";
import {postOfBlogValidationSchema} from "../middlewares/validation/postOfBlogValidationSchema";
import {postsQueryRepository} from "../repositories/posts/queryPostRepository";
import {BlogType} from "../repositories/blogs/blogSchema";
import {PostType} from "../repositories/posts/postSchema";

export const blogsRouter = Router();

blogsRouter.get("/",
    queryValidationSchema,
    async (req: RequestWithQuery<BlogQueryModel>, res: Response<Paginator<ViewBlogModel>>) => {
        const foundedBlogs: Paginator<ViewBlogModel> = await blogsQueryRepository.findBlogs(req.query);
        res.json(foundedBlogs);
    });

blogsRouter.get("/:id", async (req: RequestWithParams<UriParamsBlogModel>, res: Response<ViewBlogModel>) => {
    const foundedBlog: BlogType | null = await blogsQueryRepository.findBlogById(req.params.id);

    if (foundedBlog) {
        res.json(mapBlogTypeToBlogViewModel(foundedBlog));
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
});

blogsRouter.post("/",
    basicAuthMiddleware,
    blogValidationSchema,
    async (req: RequestWithBody<CreateBlogModel>, res: Response<ViewBlogModel>) => {
        const createdBlog: BlogType = await blogsService.createBlog(req.body.name, req.body.websiteUrl, req.body.description);

        res.status(HTTP_STATUSES.CREATED_201)
            .json(mapBlogTypeToBlogViewModel((createdBlog)));
    });

blogsRouter.put("/:id",
    basicAuthMiddleware,
    blogValidationSchema,
    async (req: RequestWithParamsAndBody<UriParamsBlogModel, UpdateBlogModel>, res: Response) => {
        const isBlogUpdated = await blogsService.updateBlog(req.params.id, req.body.name, req.body.websiteUrl);

        if (isBlogUpdated) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    });

blogsRouter.delete("/:id",
    basicAuthMiddleware,
    async (req: RequestWithParams<UriParamsBlogModel>, res: Response) => {
        const isBlogDeleted = await blogsService.deleteBlog(req.params.id);

        if (isBlogDeleted) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    }
);

blogsRouter.get("/:id/posts",
    queryValidationSchema,
    async (req: RequestWithParamsAndQuery<UriParamsBlogModel, QueryPostModel>, res: Response<Paginator<ViewPostModel>>) => {
        const foundedBlog: BlogType | null = await blogsQueryRepository.findBlogById(req.params.id);

        if (!foundedBlog) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        const foundedPostsOfBlog: Paginator<ViewPostModel> = await postsQueryRepository.findPostsOfBlog(req.params.id, req.query);
        res.json(foundedPostsOfBlog);
    }
);

blogsRouter.post("/:id/posts",
    basicAuthMiddleware,
    postOfBlogValidationSchema,
    async (req: RequestWithParamsAndBody<UriParamsBlogModel, CreatePostOfBlogModel>, res: Response<ViewPostModel>) => {
        const foundedBlog: BlogType | null = await blogsQueryRepository.findBlogById(req.params.id);
        if (!foundedBlog) { res.sendStatus(HTTP_STATUSES.NOT_FOUND_404); return;}

        const createdPostOfBlog: PostType | null = await postsService.createPost(foundedBlog.id, req.body);
        if (!createdPostOfBlog) { res.sendStatus(HTTP_STATUSES.NOT_FOUND_404); return;}

        res.status(HTTP_STATUSES.CREATED_201)
            .json(mapPostTypeToPostViewModel(createdPostOfBlog));
    }
);