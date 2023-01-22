import {BlogsQueryRepository} from "../../repositories/blogs/queryBlogRepository";
import {PostsQueryRepository} from "../../repositories/posts/queryPostRepository";
import {PostsService} from "../../domain/postsService";
import {BlogsService} from "../../domain/blogsService";
import {
    Paginator,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../../types/types";
import {BlogQueryModel} from "../../models/blog/blogQueryModel";
import {Response} from "express";
import {ViewBlogModel} from "../../models/blog/viewBlogModel";
import {UriParamsBlogModel} from "../../models/blog/uriParamsBlogModel";
import {BlogType} from "../../repositories/blogs/blogSchema";
import {mapBlogTypeToBlogViewModel, mapPostTypeToPostViewModel} from "../../helpers/mappers";
import {HTTP_STATUSES} from "../../index";
import {CreateBlogModel} from "../../models/blog/createBlogModel";
import {UpdateBlogModel} from "../../models/blog/updateBlogModel";
import {QueryPostModel} from "../../models/post/queryPostModel";
import {ViewPostModel} from "../../models/post/viewPostModel";
import {CreatePostOfBlogModel} from "../../models/post/createPostOfBlog";
import {PostType} from "../../repositories/posts/postSchema";
import {inject, injectable} from "inversify";

@injectable()
export class BlogsController {
    constructor(
        @inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository,
        @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,
        @inject(PostsService) protected postsService: PostsService,
        @inject(BlogsService) protected blogsService: BlogsService
    ) {
    }

    async getBlogs(req: RequestWithQuery<BlogQueryModel>, res: Response<Paginator<ViewBlogModel>>) {
        const foundedBlogs: Paginator<ViewBlogModel> = await this.blogsQueryRepository.findBlogs(req.query);
        res.json(foundedBlogs);
    }

    async getBlog(req: RequestWithParams<UriParamsBlogModel>, res: Response<ViewBlogModel>) {
        const foundedBlog: BlogType | null = await this.blogsQueryRepository.findBlogById(req.params.id);

        if (foundedBlog) {
            res.json(mapBlogTypeToBlogViewModel(foundedBlog));
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    }

    async createBlog(req: RequestWithBody<CreateBlogModel>, res: Response<ViewBlogModel>) {
        const createdBlog: BlogType | null = await this.blogsService.createBlog(req.body.name, req.body.websiteUrl, req.body.description);

        if (createdBlog) {
            res.status(HTTP_STATUSES.CREATED_201)
                .json(mapBlogTypeToBlogViewModel((createdBlog)));
        } else {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        }
    }

    async updateBlog(req: RequestWithParamsAndBody<UriParamsBlogModel, UpdateBlogModel>, res: Response) {
        const isBlogUpdated = await this.blogsService.updateBlog(req.params.id, req.body.name, req.body.websiteUrl);

        if (isBlogUpdated) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    }

    async deleteBlog(req: RequestWithParams<UriParamsBlogModel>, res: Response) {
        const isBlogDeleted = await this.blogsService.deleteBlog(req.params.id);

        if (isBlogDeleted) {
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        } else {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        }
    }

    async getPostsOfBlog(req: RequestWithParamsAndQuery<UriParamsBlogModel, QueryPostModel>, res: Response<Paginator<ViewPostModel>>) {
        // TODO
        // try {
        //     //
        // } catch (e) {
        //
        // }
        const foundedBlog: BlogType | null = await this.blogsQueryRepository.findBlogById(req.params.id);

        if (!foundedBlog) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        const foundedPostsOfBlog: Paginator<ViewPostModel> = await this.postsQueryRepository.findPostsOfBlog(req.params.id, req.query);
        res.json(foundedPostsOfBlog);
    }

    async createPostOfBlog(req: RequestWithParamsAndBody<UriParamsBlogModel, CreatePostOfBlogModel>, res: Response<ViewPostModel>) {
        const foundedBlog: BlogType | null = await this.blogsQueryRepository.findBlogById(req.params.id);
        if (!foundedBlog) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        const createdPostOfBlog: PostType | null = await this.postsService.createPost(foundedBlog.id, req.body);
        if (!createdPostOfBlog) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        res.status(HTTP_STATUSES.CREATED_201)
            .json(mapPostTypeToPostViewModel(createdPostOfBlog));
    }
}