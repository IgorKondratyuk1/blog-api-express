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
import {UriParamsBlogModel} from "../models/blog/uriParamsBlogModel";
import {HTTP_STATUSES} from "../index";
import {basicAuthMiddleware} from "../middlewares/auth/basicAuthMiddleware";
import {blogValidationSchema} from "../middlewares/validation/blogValidationSchema";
import {mapBlogTypeToBlogViewModel, mapPostTypeToPostViewModel} from "../helpers/mappers";
import {CreateBlogModel} from "../models/blog/createBlogModel";
import {UpdateBlogModel} from "../models/blog/updateBlogModel";
import {QueryPostModel} from "../models/post/queryPostModel";
import {ViewPostModel} from "../models/post/viewPostModel";
import {CreatePostOfBlogModel} from "../models/post/createPostOfBlog";
import {postOfBlogValidationSchema} from "../middlewares/validation/postOfBlogValidationSchema";
import {BlogType} from "../repositories/blogs/blogSchema";
import {PostType} from "../repositories/posts/postSchema";
import {BlogsQueryRepository} from "../repositories/blogs/queryBlogRepository";
import {BlogsService} from "../domain/blogsService";
import {PostsQueryRepository} from "../repositories/posts/queryPostRepository";
import {PostsService} from "../domain/postsService";

export const blogsRouter = Router();

class BlogsController {
    private blogsQueryRepository: BlogsQueryRepository;
    private postsQueryRepository: PostsQueryRepository;
    private postsService: PostsService;
    private blogsService: BlogsService;
    
    constructor() {
        this.blogsQueryRepository = new BlogsQueryRepository();
        this.postsQueryRepository = new PostsQueryRepository();
        this.blogsService = new BlogsService();
        this.postsService = new PostsService();
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

const blogController = new BlogsController();

blogsRouter.get("/",
    queryValidationSchema,
    blogController.getBlogs.bind(blogController)
);

blogsRouter.get("/:id",
    blogController.getBlog.bind(blogController)
);

blogsRouter.post("/",
    basicAuthMiddleware,
    blogValidationSchema,
    blogController.createBlog.bind(blogController)
);

blogsRouter.put("/:id",
    basicAuthMiddleware,
    blogValidationSchema,
    blogController.updateBlog.bind(blogController)
);

blogsRouter.delete("/:id",
    basicAuthMiddleware,
    blogController.deleteBlog.bind(blogController)
);

blogsRouter.get("/:id/posts",
    queryValidationSchema,
    blogController.getPostsOfBlog.bind(blogController)
);

blogsRouter.post("/:id/posts",
    basicAuthMiddleware,
    postOfBlogValidationSchema,
    blogController.createPostOfBlog.bind(blogController)
);