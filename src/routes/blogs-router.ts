import {Request, Response, Router} from "express";
import {blogsRepository} from "../repositories/blogs-repository";
import {blogValidationSchema} from "../schemas/blog-schema";
import {BlogViewModel} from "../models/blog/blog-view-model";
import {RequestWithBody, RequestWithBodyAndParams, RequestWithParams} from "../types/types";
import {CreateBlogModel} from "../models/blog/create-blog-model";
import {UpdateBlogModel} from "../models/blog/update-blog-model";
import {URIParamsBlogModel} from "../models/blog/uri-params-blog-model";
import {getBlogViewModel} from "../helpers/helpers";
import {HTTP_STATUSES} from "../index";
import {authenticationMiddleware} from "../middlewares/authentication-middleware";

export const blogsRouter = Router();

blogsRouter.get("/", (req: Request, res: Response<BlogViewModel[]>) => {
    const foundedBlogs = blogsRepository.findAllBlogs();
    res.json(foundedBlogs.map(getBlogViewModel));
});

blogsRouter.get("/:id", (req: RequestWithParams<URIParamsBlogModel>, res: Response<BlogViewModel>) => {
    const foundedBlog = blogsRepository.findBlogById(req.params.id);

    if (foundedBlog) {
        res.json(getBlogViewModel(foundedBlog));
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
});

blogsRouter.post("/",
    authenticationMiddleware,
    blogValidationSchema,
    (req: RequestWithBody<CreateBlogModel>, res: Response<BlogViewModel>) => {
    const createdBlog = blogsRepository.createBlog(req.body.name, req.body.youtubeUrl);

    res.status(HTTP_STATUSES.CREATED_201)
        .json(getBlogViewModel((createdBlog)));
});

blogsRouter.put("/:id",
    authenticationMiddleware,
    blogValidationSchema,
    (req: RequestWithBodyAndParams<URIParamsBlogModel, UpdateBlogModel>, res: Response) => {
    const isBlogUpdated = blogsRepository.updateBlog(req.params.id, req.body.name, req.body.youtubeUrl);

    if(isBlogUpdated) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
});

blogsRouter.delete("/:id",
    authenticationMiddleware,
    (req: RequestWithParams<URIParamsBlogModel>, res: Response) => {
    const isBlogDeleted = blogsRepository.deleteBlog(req.params.id);

    if(isBlogDeleted) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
});