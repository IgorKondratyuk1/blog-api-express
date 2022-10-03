import {Response, Router} from "express";
import {getPostViewModel} from "../helpers/helpers";
import {
    FilterType, Paginator,
    PostType,
    RequestWithBody,
    RequestWithParamsAndBody,
    RequestWithParams, RequestWithQuery
} from "../types/types";
import {URIParamsPostModel} from "../models/post/uri-params-post-model";
import {ViewPostModel} from "../models/post/view-post-model";
import {CreatePostModel} from "../models/post/create-post-model";
import {postValidationSchema} from "../schemas/create/post-validation-schema";
import {HTTP_STATUSES} from "../index";
import {authenticationMiddleware} from "../middlewares/authentication-middleware";
import {postsQueryRepository} from "../repositories/posts/query-post-repository";
import {QueryPostModel} from "../models/post/query-post-model";
import {postsService} from "../domain/posts-service";
import {queryValidationSchema} from "../schemas/query/query-validation-schema";

export const postsRouter = Router();

postsRouter.get("/",
    queryValidationSchema,
    async (req: RequestWithQuery<QueryPostModel>, res: Response<Paginator<ViewPostModel>>) => {
    const filters: FilterType = {
        // searchNameTerm: req.query.searchNameTerm || null,
        pageNumber: req.query.pageNumber ? +req.query.pageNumber : 1,
        pageSize: req.query.pageSize ? +req.query.pageSize : 10,
        sortBy: req.query.sortBy || "createdAt",
        sortDirection: req.query.sortDirection === 'asc' ? 'asc' : 'desc'
    }
    
    const foundedPosts: Paginator<PostType> = await postsQueryRepository.findPosts(filters);
    res.json(foundedPosts);
});

postsRouter.get("/:id", async (req: RequestWithParams<URIParamsPostModel>, res: Response<ViewPostModel>) => {
    const foundedPost: PostType | null = await postsQueryRepository.findPostById(req.params.id);

    if (foundedPost) {
        res.json(getPostViewModel(foundedPost));
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
});

postsRouter.post("/",
    authenticationMiddleware,
    postValidationSchema,
    async (req: RequestWithBody<CreatePostModel>, res: Response<ViewPostModel>) => {
    const createdPost = await postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);

    res.status(HTTP_STATUSES.CREATED_201)
        .json(getPostViewModel((createdPost)));
});

postsRouter.put("/:id",
    authenticationMiddleware,
    postValidationSchema,
    async (req: RequestWithParamsAndBody<URIParamsPostModel,CreatePostModel>, res: Response) => {
    const isPostUpdated = await postsService.updatePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);

    if(isPostUpdated) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
});

postsRouter.delete("/:id",
    authenticationMiddleware,
    async (req: RequestWithParams<URIParamsPostModel>, res: Response) => {
    const isPostDeleted = await postsService.deletePost(req.params.id);

    if (isPostDeleted) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
});

