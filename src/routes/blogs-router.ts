import {Response, Router} from "express";
import {blogsService} from "../domain/blogs-service";
import {blogValidationSchema} from "../schemas/create/blog-validation-schema";
import {ViewBlogModel} from "../models/blog/view-blog-model";
import {
    BlogType,
    FilterType, Paginator,
    RequestWithBody,
    RequestWithParamsAndBody,
    RequestWithParams, RequestWithParamsAndQuery,
    RequestWithQuery, PostType
} from "../types/types";
import {CreateBlogModel} from "../models/blog/create-blog-model";
import {UpdateBlogModel} from "../models/blog/update-blog-model";
import {URIParamsBlogModel} from "../models/blog/uri-params-blog-model";
import {getBlogViewModel, getPostViewModel} from "../helpers/helpers";
import {HTTP_STATUSES} from "../index";
import {authenticationMiddleware} from "../middlewares/authentication-middleware";
import {QueryBlogModel} from "../models/blog/query-blog-model";
import {blogsQueryRepository} from "../repositories/blogs/query-blog-repository";
import {URIParamsPostModel} from "../models/post/uri-params-post-model";
import {QueryPostModel} from "../models/post/query-post-model";
import {ViewPostModel} from "../models/post/view-post-model";
import {postsQueryRepository} from "../repositories/posts/query-post-repository";
import {postsService} from "../domain/posts-service";
import {CreatePostofBlogModel} from "../models/post/create-post-of-blog";
import {queryValidationSchema} from "../schemas/query/query-validation-schema";


export const blogsRouter = Router();

// const getParams = (query: any) => {
//
//     return {
//         pageNumber: query.pageNumber || 1,
//         pageSize
//         sortBy
//         sortDirection
//     }
// }

// TODO: Validate Query input params
blogsRouter.get("/",
    queryValidationSchema,
    async (req: RequestWithQuery<QueryBlogModel>, res: Response<Paginator<ViewBlogModel>>) => {
    const filters: FilterType = {
        searchNameTerm: req.query.searchNameTerm || null,
        pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        pageSize: req.query.pageSize ? +req.query.pageSize : 10,
        sortBy: req.query.sortBy || "createdAt",
        sortDirection: req.query.sortDirection === 'asc' ? 'asc' : 'desc'
    }

    const foundedBlogs: Paginator<BlogType> = await blogsQueryRepository.findBlogs(filters);
    res.json(foundedBlogs);
});

blogsRouter.get("/:id", async (req: RequestWithParams<URIParamsBlogModel>, res: Response<ViewBlogModel>) => {
    const foundedBlog: BlogType | null = await blogsQueryRepository.findBlogById(req.params.id);

    if (foundedBlog) {
        res.json(getBlogViewModel(foundedBlog));
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
});

blogsRouter.post("/",
    authenticationMiddleware,
    blogValidationSchema,
    async (req: RequestWithBody<CreateBlogModel>, res: Response<ViewBlogModel>) => {
    const createdBlog: BlogType = await blogsService.createBlog(req.body.name, req.body.youtubeUrl);

    res.status(HTTP_STATUSES.CREATED_201)
        .json(getBlogViewModel((createdBlog)));
});

blogsRouter.put("/:id",
    authenticationMiddleware,
    blogValidationSchema,
    async (req: RequestWithParamsAndBody<URIParamsBlogModel, UpdateBlogModel>, res: Response) => {
    const isBlogUpdated = await blogsService.updateBlog(req.params.id, req.body.name, req.body.youtubeUrl);

    if(isBlogUpdated) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
});

blogsRouter.delete("/:id",
    authenticationMiddleware,
    async (req: RequestWithParams<URIParamsBlogModel>, res: Response) => {
    const isBlogDeleted = await blogsService.deleteBlog(req.params.id);

    if(isBlogDeleted) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
});

// TODO Question: id or blogId in params
blogsRouter.get("/:id/posts",
    queryValidationSchema,
    async (req: RequestWithParamsAndQuery<URIParamsBlogModel, QueryPostModel>, res: Response<Paginator<ViewPostModel>>) => {
    const filters: FilterType = {
        //searchNameTerm: req.query.searchNameTerm || null,
        pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        pageSize: req.query.pageSize ? +req.query.pageSize : 10,
        sortBy: req.query.sortBy || "createdAt",
        sortDirection: req.query.sortDirection === 'asc' ? 'asc' : 'desc'
    }

    const foundedBlog: BlogType | null = await blogsQueryRepository.findBlogById(req.params.id);

    if (!foundedBlog) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }

    const foundedPostsOfBlog: Paginator<ViewPostModel> = await postsQueryRepository.findBlogPosts(filters, req.params.id);
    res.json(foundedPostsOfBlog);
});

blogsRouter.post("/:id/posts",
    authenticationMiddleware,
    async (req: RequestWithParamsAndBody<URIParamsBlogModel, CreatePostofBlogModel>, res: Response<ViewPostModel>) => {
    const foundedBlog: BlogType | null = await blogsQueryRepository.findBlogById(req.params.id);

    if (!foundedBlog) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }

    const createdPostOfBlog: PostType = await postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.params.id);
    res.json(getPostViewModel(createdPostOfBlog));
});