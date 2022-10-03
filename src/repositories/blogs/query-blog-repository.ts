import {BlogType, FilterType, Paginator} from "../../types/types";
import {blogsCollection} from "../db";
import {getBlogViewModel} from "../../helpers/helpers";
import {ViewBlogModel} from "../../models/blog/view-blog-model";

export const blogsQueryRepository = {
    async findBlogs(filters: FilterType): Promise<Paginator<BlogType>> {
        const {pageSize, pageNumber, sortBy, sortDirection, searchNameTerm} = filters;
        const skipValue = (pageNumber - 1) * pageSize;
        const sortValue = sortDirection === "asc" ? 1 : -1;
        const searchNameTermValue = searchNameTerm || "";


        const foundedBlogs: BlogType[] = await blogsCollection.find({name: {$regex: new RegExp(searchNameTermValue, 'i') }}).sort({[sortBy]: sortValue}).skip(skipValue).limit(pageSize).toArray();
        const blogsViewModels: ViewBlogModel[] = foundedBlogs.map(getBlogViewModel); // Get Output/View models of Blogs
        const totalCount: number = await blogsCollection.countDocuments({name: {$regex: new RegExp(searchNameTermValue, 'i')}});

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: blogsViewModels
        };
    },
    async findBlogById(id: string): Promise<BlogType | null> {
        return blogsCollection.findOne({id: id});
    }
}