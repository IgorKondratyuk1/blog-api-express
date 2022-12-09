import {FilterType, Paginator} from "../../types/types";
import {getFilters, getPagesCount, getSkipValue, getSortValue} from "../../helpers/helpers";
import {BlogQueryModel} from "../../models/blog/blogQueryModel";
import {ViewBlogModel} from "../../models/blog/viewBlogModel";
import {mapBlogTypeToBlogViewModel} from "../../helpers/mappers";
import {BlogDbType, BlogModel} from "./blogSchema";

export const blogsQueryRepository = {
    async findBlogs(queryObj: BlogQueryModel): Promise<Paginator<ViewBlogModel>> {
        const filters: FilterType = getFilters(queryObj);
        const skipValue: number = getSkipValue(filters.pageNumber, filters.pageSize);
        const sortValue: 1 | -1 = getSortValue(filters.sortDirection);
        const searchNameTermValue = filters.searchNameTerm || "";

        const foundedBlogs: BlogDbType[] = await BlogModel
            .find({name: {$regex: new RegExp(searchNameTermValue, 'i') }})
            .sort({[filters.sortBy]: sortValue})
            .skip(skipValue)
            .limit(filters.pageSize).lean();

        const blogsViewModels: ViewBlogModel[] = foundedBlogs.map(mapBlogTypeToBlogViewModel); // Get View models of Blogs
        const totalCount: number = await BlogModel.countDocuments({name: {$regex: new RegExp(searchNameTermValue, 'i')}});
        const pagesCount = getPagesCount(totalCount, filters.pageSize);

        return {
            pagesCount: pagesCount,
            page: filters.pageNumber,
            pageSize: filters.pageSize,
            totalCount: totalCount,
            items: blogsViewModels
        };
    },
    async findBlogById(id: string): Promise<BlogDbType | null> {
        return BlogModel.findOne({id});
    }
}