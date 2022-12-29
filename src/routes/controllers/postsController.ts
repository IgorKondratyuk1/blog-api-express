import {PostsQueryRepository} from "../../repositories/posts/queryPostRepository";
import {PostsService} from "../../domain/postsService";
import {PostsRepository} from "../../repositories/posts/postsRepository";
import {CommentError, CommentsService} from "../../domain/commentsService";
import {
    Paginator,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../../types/types";
import {QueryPostModel} from "../../models/post/queryPostModel";
import {Response} from "express";
import {ViewPostModel} from "../../models/post/viewPostModel";
import {UriParamsPostModel} from "../../models/post/uriParamsPostModel";
import {PostType} from "../../repositories/posts/postSchema";
import {mapCommentDbTypeToViewCommentModel, mapPostTypeToPostViewModel} from "../../helpers/mappers";
import {HTTP_STATUSES} from "../../index";
import {CreatePostModel} from "../../models/post/createPostModel";
import {UpdatePostModel} from "../../models/post/updatePostModel";
import {QueryCommentModel} from "../../models/comment/queryCommentModel";
import {ViewCommentModel} from "../../models/comment/viewCommentModel";
import {UriParamsCommentModel} from "../../models/comment/uriParamsCommentModel";
import {CreateCommentModel} from "../../models/comment/createCommentModel";
import {CommentType} from "../../repositories/comments/commentSchema";
import {CommentsWithLikesQueryRepository} from "../../repositories/comments/queryCommentsWithLikesRepository";

export class PostsController {
    constructor(
        protected postsQueryRepository: PostsQueryRepository,
        protected postsService: PostsService,
        protected postsRepository: PostsRepository,
        protected commentsQueryRepository: CommentsWithLikesQueryRepository,
        protected commentsService: CommentsService
    ) {
    }

    async getPosts(req: RequestWithQuery<QueryPostModel>, res: Response<Paginator<ViewPostModel>>) {
        const foundedPosts: Paginator<ViewPostModel> = await this.postsQueryRepository.findPosts(req.query);
        res.json(foundedPosts);
    }

    async getPost(req: RequestWithParams<UriParamsPostModel>, res: Response<ViewPostModel>) {
        const foundedPost: PostType | null = await this.postsQueryRepository.findPostById(req.params.id);

        if (foundedPost) {
            res.json(mapPostTypeToPostViewModel(foundedPost));
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    }

    async createPost(req: RequestWithBody<CreatePostModel>, res: Response<ViewPostModel>) {
        const createdPost: PostType | null = await this.postsService.createPost(req.body.blogId, req.body);

        if (!createdPost) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        res.status(HTTP_STATUSES.CREATED_201)
            .json(mapPostTypeToPostViewModel((createdPost)));
    }

    async updatePost(req: RequestWithParamsAndBody<UriParamsPostModel, UpdatePostModel>, res: Response) {
        const isPostUpdated = await this.postsService.updatePost(req.params.id, req.body);

        if (isPostUpdated) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    }

    async deletePost(req: RequestWithParams<UriParamsPostModel>, res: Response) {
        const isPostDeleted = await this.postsService.deletePost(req.params.id);

        if (isPostDeleted) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    }

    async getCommentsOfPost(req: RequestWithParamsAndQuery<UriParamsPostModel, QueryCommentModel>, res: Response<Paginator<ViewCommentModel>>) {
        const foundedPost: PostType | null = await this.postsRepository.findPostById(req.params.id);

        if (!foundedPost) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        const foundedCommentsOfPost: Paginator<ViewCommentModel> = await this.commentsQueryRepository.findCommentsOfPost(req.user!.id, req.params.id, req.query);
        res.json(foundedCommentsOfPost);
    }


    async createCommentOfPost(req: RequestWithParamsAndBody<UriParamsCommentModel, CreateCommentModel>, res: Response<ViewCommentModel>) {
        const foundedPost: PostType | null = await this.postsRepository.findPostById(req.params.id);
        if (!foundedPost) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        // TODO Change result type from CommentType | CommentError. And refactor switch
        const result: CommentType | CommentError = await this.commentsService.createComment(req.params.id, req.user!.id, req.body);
        switch (result) {
            case CommentError.CreationError:
                res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
                return;
            case CommentError.WrongUserError:
                res.sendStatus(HTTP_STATUSES.FORBIDDEN_403);
                return;
            case CommentError.NotFoundError:
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
                return;
            case CommentError.Success:
                return;
        }

        // TODO Change "None" status
        res.status(HTTP_STATUSES.CREATED_201)
            .json(mapCommentDbTypeToViewCommentModel(result, "None"));
    }
}