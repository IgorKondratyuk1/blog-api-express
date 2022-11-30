import {commentsCollection} from "../db";
import {FilterType, Paginator} from "../../types/types";
import {getFilters, getPagesCount, getSkipValue, getSortValue} from "../../helpers/helpers";
import {ViewCommentModel} from "../../models/comment/viewCommentModel";
import {CommentDbType} from "../../types/commentTypes";
import {QueryCommentModel} from "../../models/comment/queryCommentModel";
import {mapCommentDbTypeToViewCommentModel} from "../../helpers/mappers";

export const commentsQueryRepository = {
    async findCommentById(id: string): Promise<ViewCommentModel | null> {
        const dbComment: CommentDbType | null = await commentsCollection.findOne({id: id});
        if (!dbComment) return null;
        return mapCommentDbTypeToViewCommentModel(dbComment);
    },
    async findCommentsOfPost(postId: string, queryObj: QueryCommentModel): Promise<Paginator<ViewCommentModel>> {
        const filters: FilterType = getFilters(queryObj);
        const skipValue: number = getSkipValue(filters.pageNumber, filters.pageSize);
        const sortValue: 1 | -1 = getSortValue(filters.sortDirection);

        const foundedPosts: CommentDbType[] = await commentsCollection
            .find({postId: postId})
            .sort({[filters.sortBy]: sortValue})
            .skip(skipValue)
            .limit(filters.pageSize).toArray();

        const commentsViewModels: ViewCommentModel[] = foundedPosts.map(mapCommentDbTypeToViewCommentModel);
        const totalCount: number = await commentsCollection.countDocuments({postId: postId});
        const pagesCount = getPagesCount(totalCount, filters.pageSize);

        return {
            pagesCount: pagesCount,
            page: filters.pageNumber,
            pageSize: filters.pageSize,
            totalCount: totalCount,
            items: commentsViewModels
        };
    }
}