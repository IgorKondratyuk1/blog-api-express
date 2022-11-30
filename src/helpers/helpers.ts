import {FilterType, QueryType} from "../types/types";
import {SETTINGS} from "../config";
import {QueryUserModel,  UserFilterType} from "../types/userTypes";

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

export const cookiesSettings = () => {
    return {
        httpOnly: true,
        secure: !SETTINGS.IS_LOCAL_VERSION,
        maxAge: Number(SETTINGS.REFRESH_TOKEN_EXPIRATION) * 1000 // ms
    }
}
