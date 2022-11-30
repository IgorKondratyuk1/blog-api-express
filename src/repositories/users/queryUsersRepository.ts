import {Paginator} from "../../types/types";
import {getPagesCount, getSkipValue, getSortValue, getUserFilters} from "../../helpers/helpers";
import {usersCollection} from "../db";
import {QueryUserModel, UserAccountDbType, UserFilterType} from "../../types/userTypes";
import {ViewUserModel} from "../../models/user/viewUserModel";
import {mapUserAccountDbTypeToViewUserModel} from "../../helpers/mappers";

export const usersQueryRepository = {
    async findUsers(queryObj: QueryUserModel): Promise<Paginator<ViewUserModel>> {
        const filters: UserFilterType = getUserFilters(queryObj);
        const skipValue: number = getSkipValue(filters.pageNumber, filters.pageSize);
        const sortValue: 1 | -1 = getSortValue(filters.sortDirection);
        const searchLoginTermValue = filters.searchLoginTerm || "";
        const searchEmailTermValue = filters.searchEmailTerm || "";

        const foundedUsers: UserAccountDbType[] = await usersCollection
            .find({$or: [{'accountData.login': {$regex: searchLoginTermValue, $options: "i"}}, {'accountData.email': {$regex: searchEmailTermValue, $options: "i"}}]})
            .sort({[filters.sortBy]: sortValue})
            .skip(skipValue)
            .limit(filters.pageSize).toArray();

        const usersViewModels: ViewUserModel[] = foundedUsers.map(mapUserAccountDbTypeToViewUserModel); // Get View models of Blogs
        const totalCount: number = await usersCollection.countDocuments({$or: [{'accountData.login': {$regex: searchLoginTermValue, $options: "i"}}, {'accountData.email': {$regex: searchEmailTermValue, $options: "i"}}]});
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

        return mapUserAccountDbTypeToViewUserModel(dbUser);
    }
}