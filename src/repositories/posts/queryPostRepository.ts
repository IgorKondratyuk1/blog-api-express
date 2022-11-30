import {postsCollection} from "../db";
import {FilterType, Paginator} from "../../types/types";
import {getFilters, getPagesCount, getSkipValue, getSortValue} from "../../helpers/helpers";
import {QueryPostModel} from "../../models/post/queryPostModel";
import {PostType} from "../../types/postTypes";
import {ViewPostModel} from "../../models/post/viewPostModel";
import {mapPostDbTypeToPostType, mapPostTypeToPostViewModel} from "../../helpers/mappers";

export const postsQueryRepository = {
    async findPosts(queryObj: QueryPostModel): Promise<Paginator<PostType>> {
        const filters: FilterType = getFilters(queryObj);
        const skipValue: number = getSkipValue(filters.pageNumber, filters.pageSize);
        const sortValue: 1 | -1 = getSortValue(filters.sortDirection);

        const foundedPosts: PostType[] = await postsCollection
            .find({})
            .sort({[filters.sortBy]: sortValue})
            .skip(skipValue)
            .limit(filters.pageSize).toArray();
        const postsViewModels: ViewPostModel[] = foundedPosts.map(mapPostTypeToPostViewModel); // Get Output/View models of Posts via mapping
        const totalCount: number = await postsCollection.countDocuments();
        const pagesCount = getPagesCount(totalCount, filters.pageSize);

        return {
            pagesCount: pagesCount,
            page: filters.pageNumber,
            pageSize: filters.pageSize,
            totalCount: totalCount,
            items: postsViewModels
        };
    },
    async findPostById(id: string): Promise<PostType | null> {
        return postsCollection.findOne({id: id});
    },
    async findPostsOfBlog(blogId: string, queryObj: QueryPostModel): Promise<Paginator<ViewPostModel>> {
        const filters: FilterType = getFilters(queryObj);
        const skipValue: number = getSkipValue(filters.pageNumber, filters.pageSize);
        const sortValue: 1 | -1 = getSortValue(filters.sortDirection);

        const foundedPosts: PostType[] = await postsCollection
            .find({blogId: blogId})
            .sort({[filters.sortBy]: sortValue})
            .skip(skipValue)
            .limit(filters.pageSize).toArray();
        const postsViewModels: ViewPostModel[] = foundedPosts.map(mapPostTypeToPostViewModel); // Get View models of Posts via mapping
        const totalCount: number = await postsCollection.countDocuments({blogId: blogId});
        const pagesCount = getPagesCount(totalCount, filters.pageSize);

        return {
            pagesCount: pagesCount,
            page: filters.pageNumber,
            pageSize: filters.pageSize,
            totalCount: totalCount,
            items: postsViewModels
        };
    }
}