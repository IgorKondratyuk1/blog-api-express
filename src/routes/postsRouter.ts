import {Response, Router} from "express";
import {
    Paginator,
    RequestWithBody,
    RequestWithParamsAndBody,
    RequestWithParams, RequestWithQuery, RequestWithParamsAndQuery
} from "../types/types";
import {queryValidationSchema} from "../schemas/query/queryValidationSchema";
import {ViewPostModel} from "../models/post/viewPostModel";
import {postsQueryRepository} from "../repositories/posts/queryPostRepository";
import {QueryPostModel} from "../models/post/queryPostModel";
import {PostType} from "../types/postTypes";
import {HTTP_STATUSES} from "../index";
import {UriParamsPostModel} from "../models/post/uriParamsPostModel";
import {mapPostTypeToPostViewModel} from "../helpers/mappers";
import {basicAuthMiddleware} from "../middlewares/basicAuthMiddleware";
import {postValidationSchema} from "../schemas/postValidationSchema";
import {CreatePostModel} from "../models/post/createPostModel";
import {postsService} from "../domain/postsService";
import {UpdatePostModel} from "../models/post/updatePostModel";
import {QueryCommentModel} from "../models/comment/queryCommentModel";
import {ViewCommentModel} from "../models/comment/viewCommentModel";
import {postsRepository} from "../repositories/posts/postsRepository";
import {UriParamsCommentModel} from "../models/comment/uriParamsCommentModel";
import {CreateCommentModel} from "../models/comment/createCommentModel";
import {jwtAuthMiddleware} from "../middlewares/jwtAuthMiddlewsre";
import {commentsQueryRepository} from "../repositories/comments/queryCommentsRepository";
import {commentValidationSchema} from "../schemas/commentValidationSchema";
import {commentsService} from "../domain/commentsService";


export const postsRouter = Router();

postsRouter.get("/",
    queryValidationSchema,
    async (req: RequestWithQuery<QueryPostModel>, res: Response<Paginator<ViewPostModel>>) => {

    const foundedPosts: Paginator<PostType> = await postsQueryRepository.findPosts(req.query);
    res.json(foundedPosts);
});

postsRouter.get("/:id", async (req: RequestWithParams<UriParamsPostModel>, res: Response<ViewPostModel>) => {
    const foundedPost: PostType | null = await postsQueryRepository.findPostById(req.params.id);

    if (foundedPost) {
        res.json(mapPostTypeToPostViewModel(foundedPost));
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
        .json(mapPostTypeToPostViewModel((createdPost)));
});

postsRouter.put("/:id",
    basicAuthMiddleware,
    postValidationSchema,
    async (req: RequestWithParamsAndBody<UriParamsPostModel,UpdatePostModel>, res: Response) => {
    const isPostUpdated = await postsService.updatePost(req.params.id, req.body);

    if(isPostUpdated) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
});

postsRouter.delete("/:id",
    basicAuthMiddleware,
    async (req: RequestWithParams<UriParamsPostModel>, res: Response) => {
    const isPostDeleted = await postsService.deletePost(req.params.id);

    if (isPostDeleted) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
});

postsRouter.get("/:id/comments", async (req: RequestWithParamsAndQuery<UriParamsPostModel, QueryCommentModel>, res: Response<Paginator<ViewCommentModel>>) => {
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

    const createdCommentsOfPost: ViewCommentModel = await commentsService.createComment(req.params.id, req.user!.id, req.body);

    res.status(HTTP_STATUSES.CREATED_201)
        .json(createdCommentsOfPost);
});