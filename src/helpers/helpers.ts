import {ViewBlogModel} from "../models/blog/view-blog-model";
import {FilterType, QueryType, SortDirections} from "../types/types";
import {ViewPostModel} from "../models/post/view-post-model";
import {QueryUserModel, UserDBType, UserFilterType, UserType} from "../types/user-types";
import {PostType} from "../types/post-types";
import {BlogType} from "../types/blog-types";
import {ViewMeModel} from "../models/auth/view-me-model";

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

export const getMeViewModel = (user: UserType | UserDBType): ViewMeModel => {
    return {
        email: user.email,
        login: user.login,
        userId: user.id
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

export const getCommentsFilters = (query: QueryType): FilterType => {
    const filters: FilterType = {
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