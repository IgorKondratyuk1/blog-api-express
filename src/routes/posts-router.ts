import {Response, Router} from "express";
import {getPostViewModel} from "../helpers/helpers";
import {
    Paginator,
    RequestWithBody,
    RequestWithParamsAndBody,
    RequestWithParams, RequestWithQuery, RequestWithParamsAndQuery
} from "../types/types";
import {URIParamsPostModel} from "../models/post/uri-params-post-model";
import {ViewPostModel} from "../models/post/view-post-model";
import {CreatePostModel} from "../models/post/create-post-model";
import {postValidationSchema} from "../schemas/post-validation-schema";
import {HTTP_STATUSES} from "../index";
import {postsQueryRepository} from "../repositories/posts/query-post-repository";
import {QueryPostModel} from "../models/post/query-post-model";
import {postsService} from "../domain/posts-service";
import {queryValidationSchema} from "../schemas/query/query-validation-schema";
import {UpdatePostModel} from "../models/post/update-post-model";
import {PostType} from "../types/post-types";
import {ViewCommentModel} from "../models/comment/view-comment-model";
import {commentsQueryRepository} from "../repositories/comments/query-comments-repository";
import {QueryCommentModel} from "../models/comment/query-comment-model";
import {postsRepository} from "../repositories/posts/posts-repository";
import {UriParamsCommentModel} from "../models/comment/uri-params-comment-model";
import {CreateCommentModel} from "../models/comment/create-comment-model";
import {commentValidationSchema} from "../schemas/comment-validation-schema";
import {commentsService} from "../domain/comments-service";
import {basicAuthMiddleware} from "../middlewares/basic-auth-middleware";
import {jwtAuthMiddleware} from "../middlewares/jwt-auth-middlewsre";

export const postsRouter = Router();

postsRouter.get("/",
    queryValidationSchema,
    async (req: RequestWithQuery<QueryPostModel>, res: Response<Paginator<ViewPostModel>>) => {

    const foundedPosts: Paginator<PostType> = await postsQueryRepository.findPosts(req.query);
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
    basicAuthMiddleware,
    postValidationSchema,
    async (req: RequestWithBody<CreatePostModel>, res: Response<ViewPostModel>) => {
    const createdPost = await postsService.createPost(req.body.blogId, req.body);

    res.status(HTTP_STATUSES.CREATED_201)
        .json(getPostViewModel((createdPost)));
});

postsRouter.put("/:id",
    basicAuthMiddleware,
    postValidationSchema,
    async (req: RequestWithParamsAndBody<URIParamsPostModel,UpdatePostModel>, res: Response) => {
    const isPostUpdated = await postsService.updatePost(req.params.id, req.body);

    if(isPostUpdated) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
});

postsRouter.delete("/:id",
    basicAuthMiddleware,
    async (req: RequestWithParams<URIParamsPostModel>, res: Response) => {
    const isPostDeleted = await postsService.deletePost(req.params.id);

    if (isPostDeleted) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
});

postsRouter.get("/:id/comments", async (req: RequestWithParamsAndQuery<URIParamsPostModel, QueryCommentModel>, res: Response<Paginator<ViewCommentModel>>) => {
    const foundedPost: PostType | null = await postsRepository.findPostById(req.params.id);

    if (!foundedPost) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }

    const foundedCommentsOfPost: Paginator<ViewCommentModel> = await commentsQueryRepository.findCommentsOfPost(req.params.id, req.query);
    res.json(foundedCommentsOfPost);
});

postsRouter.post("/:id/comments",
    jwtAuthMiddleware,
    commentValidationSchema,
    async (req: RequestWithParamsAndBody<UriParamsCommentModel, CreateCommentModel>, res: Response<ViewCommentModel>) => {

    const foundedPost: PostType | null = await postsRepository.findPostById(req.params.id);

    if (!foundedPost) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }

    const createdCommentsOfPost: ViewCommentModel = await commentsService.createComment(req.params.id, req.user.id, req.body);

    res.status(HTTP_STATUSES.CREATED_201)
        .json(createdCommentsOfPost);
});