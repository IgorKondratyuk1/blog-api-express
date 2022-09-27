import {Request, Response, Router} from "express";
import {postsRepository} from "../repositories/posts-repository";
import {getPostViewModel} from "../helpers/helpers";
import {APIErrorResult, PostType, RequestWithBody, RequestWithBodyAndParams, RequestWithParams} from "../types/types";
import {URIParamsPostModel} from "../models/post/uri-params-post-model";
import {PostViewModel} from "../models/post/post-view-model";
import {CreatePostModel} from "../models/post/create-post-model";
import {postValidationSchema} from "../schemas/post-validation-schema";
import {HTTP_STATUSES} from "../index";
import {authenticationMiddleware} from "../middlewares/authentication-middleware";

export const postsRouter = Router();

postsRouter.get("/", async (req: Request, res: Response<PostViewModel[]>) => {
    const foundedPosts: PostType[] = await postsRepository.findAllPosts();
    res.json(foundedPosts.map(getPostViewModel));
});

postsRouter.get("/:id", async (req: RequestWithParams<URIParamsPostModel>, res: Response<PostViewModel>) => {
    const foundedPost: PostType | null = await postsRepository.findPostById(req.params.id);

    if (foundedPost) {
        res.json(getPostViewModel(foundedPost));
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
});

postsRouter.post("/",
    authenticationMiddleware,
    postValidationSchema,
    async (req: RequestWithBody<CreatePostModel>, res: Response<PostViewModel | APIErrorResult>) => {
    const createdPost = await postsRepository.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);

    res.status(HTTP_STATUSES.CREATED_201)
        .json(getPostViewModel((createdPost)));
});

postsRouter.put("/:id",
    authenticationMiddleware,
    postValidationSchema,
    async (req: RequestWithBodyAndParams<URIParamsPostModel,CreatePostModel>, res: Response) => {
    const isPostUpdated = await postsRepository.updatePost(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);

    if(isPostUpdated) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
});

postsRouter.delete("/:id",
    authenticationMiddleware,
    async (req: RequestWithParams<URIParamsPostModel>, res: Response) => {
    const isPostDeleted = await postsRepository.deletePost(req.params.id);

    if (isPostDeleted) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
});

