import {QueryUserModel, UserDBType, UserFilterType, UserType} from "../../types/user-types";
import {Paginator} from "../../types/types";
import {ViewUserModel} from "../../models/users/view-user-model";
import {getPagesCount, getSkipValue, getSortValue, getUserFilters} from "../../helpers/helpers";
import {usersCollection} from "../db";

export const usersQueryRepository = {
    async findUsers(queryObj: QueryUserModel): Promise<Paginator<ViewUserModel>> {
        const filters: UserFilterType = getUserFilters(queryObj);
        const skipValue: number = getSkipValue(filters.pageNumber, filters.pageSize);
        const sortValue: 1 | -1 = getSortValue(filters.sortDirection);
        const searchLoginTermValue = filters.searchLoginTerm || "";
        const searchEmailTermValue = filters.searchEmailTerm || "";
        console.log(searchLoginTermValue);
        console.log(searchEmailTermValue);
        const foundedUsers: UserDBType[] = await usersCollection
            .find({$or: [{login: {$regex: searchLoginTermValue, $options: "(?i)a(?-i)cme"}}, {email: {$regex: searchEmailTermValue, $options: "(?i)a(?-i)cme"}}]})
            .sort({[filters.sortBy]: sortValue})
            .skip(skipValue)
            .limit(filters.pageSize).toArray();

        const usersViewModels: ViewUserModel[] = foundedUsers.map(this._mapUserDBTypeToViewUserModel); // Get View models of Blogs
        const totalCount: number = await usersCollection.countDocuments({$or: [{login: {$regex: searchLoginTermValue, $options: "i"}}, {email: {$regex: searchEmailTermValue, $options: "i"}}]});
        const pagesCount = getPagesCount(totalCount, filters.pageSize);

        return {
            pagesCount: pagesCount,
            page: filters.pageNumber,
            pageSize: filters.pageSize,
            totalCount: totalCount,
            items: usersViewModels
        };
    },
    async findUserById(id: string): Promise<ViewUserModel | null> {
        const dbUser = await usersCollection.findOne({id: id});
        if (!dbUser) return null;

        return this._mapUserDBTypeToViewUserModel(dbUser);
    },
    _mapUserDBTypeToViewUserModel(dbUser: UserDBType): ViewUserModel {
        return {
            id: dbUser.id,
            email: dbUser.email,
            login: dbUser.login,
            createdAt: dbUser.createdAt
        }
    }
}