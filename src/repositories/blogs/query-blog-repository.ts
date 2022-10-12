import {FilterType, Paginator} from "../../types/types";
import {blogsCollection} from "../db";
import {getBlogViewModel, getFilters, getPagesCount, getSkipValue, getSortValue} from "../../helpers/helpers";
import {ViewBlogModel} from "../../models/blog/view-blog-model";
import {QueryBlogModel} from "../../models/blog/query-blog-model";
import {BlogDbType} from "../../types/blog-types";

export const blogsQueryRepository = {
    async findBlogs(queryObj: QueryBlogModel): Promise<Paginator<ViewBlogModel>> {
        const filters: FilterType = getFilters(queryObj);
        const skipValue: number = getSkipValue(filters.pageNumber, filters.pageSize);
        const sortValue: 1 | -1 = getSortValue(filters.sortDirection);
        const searchNameTermValue = filters.searchNameTerm || "";

        const foundedBlogs: BlogDbType[] = await blogsCollection
            .find({name: {$regex: new RegExp(searchNameTermValue, 'i') }})
            .sort({[filters.sortBy]: sortValue})
            .skip(skipValue)
            .limit(filters.pageSize).toArray();

        const blogsViewModels: ViewBlogModel[] = foundedBlogs.map(getBlogViewModel); // Get View models of Blogs
        const totalCount: number = await blogsCollection.countDocuments({name: {$regex: new RegExp(searchNameTermValue, 'i')}});
        const pagesCount = getPagesCount(totalCount, filters.pageSize);

        return {
            pagesCount: pagesCount,
            page: filters.pageNumber,
            pageSize: filters.pageSize,
            totalCount: totalCount,
            items: blogsViewModels
        };
    },
    async findBlogById(id: string): Promise<ViewBlogModel | null> {
        return blogsCollection.findOne({id: id});
    }
}