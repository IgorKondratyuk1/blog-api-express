import {ViewBlogModel} from "../models/blog/view-blog-model";
import {BlogType, FilterType, PostType, QueryType} from "../types/types";
import {ViewPostModel} from "../models/post/view-post-model";
import {QueryUserModel, UserFilterType} from "../types/user-types";

export const getBlogViewModel = (dbBlog: BlogType): ViewBlogModel => {
    return {
        id: dbBlog.id,
        name: dbBlog.name,
        youtubeUrl: dbBlog.youtubeUrl,
        createdAt: dbBlog.createdAt
    }
}

export const getPostViewModel = (dbPost: PostType): ViewPostModel => {
    return {
        id:	dbPost.id,
        title: dbPost.title,
        shortDescription: dbPost.shortDescription,
        content: dbPost.content,
        blogId:	dbPost.blogId,
        blogName: dbPost.blogName,
        createdAt: dbPost.createdAt
    }
}

export const getFilters = (query: QueryType): FilterType => {
    const filters: FilterType = {
        searchNameTerm: query.searchNameTerm || null,
        pageNumber: query.pageNumber ? +query.pageNumber : 1,
        pageSize: query.pageSize ? +query.pageSize : 10,
        sortBy: query.sortBy || "createdAt",
        sortDirection: query.sortDirection === 'asc' ? 'asc' : 'desc'
    }

    return filters;
}

export const getUserFilters = (query: QueryUserModel): UserFilterType => {
    const filters: UserFilterType = {
        searchEmailTerm: query.searchEmailTerm || null,
        searchLoginTerm: query.searchLoginTerm || null,
        pageNumber: query.pageNumber ? +query.pageNumber : 1,
        pageSize: query.pageSize ? +query.pageSize : 10,
        sortBy: query.sortBy || "createdAt",
        sortDirection: query.sortDirection === 'asc' ? 'asc' : 'desc'
    }

    return filters;
}

export const getSkipValue = (pageNumber: number, pageSize: number): number => {
    return (pageNumber - 1) * pageSize;
}

export const getSortValue = (sortDirection: string): 1 | -1 => {
    return sortDirection === "asc" ? 1 : -1
}

export const getPagesCount = (totalCount: number, pageSize: number): number  => {
    return Math.ceil(totalCount / pageSize);
}