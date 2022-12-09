import {FilterType, Paginator} from "../../types/types";
import {getFilters, getPagesCount, getSkipValue, getSortValue} from "../../helpers/helpers";
import {ViewCommentModel} from "../../models/comment/viewCommentModel";
import {QueryCommentModel} from "../../models/comment/queryCommentModel";
import {mapCommentDbTypeToViewCommentModel} from "../../helpers/mappers";
import {CommentDbType, CommentModel} from "./commentSchema";

export const commentsQueryRepository = {
    async findCommentById(id: string): Promise<ViewCommentModel | null> {
        const dbComment: CommentDbType | null = await CommentModel.findOne({id: id});
        if (!dbComment) return null;
        return mapCommentDbTypeToViewCommentModel(dbComment);
    },
    async findCommentsOfPost(postId: string, queryObj: QueryCommentModel): Promise<Paginator<ViewCommentModel>> {
        const filters: FilterType = getFilters(queryObj);
        const skipValue: number = getSkipValue(filters.pageNumber, filters.pageSize);
        const sortValue: 1 | -1 = getSortValue(filters.sortDirection);

        const foundedPosts: CommentDbType[] = await CommentModel
            .find({postId})
            .sort({[filters.sortBy]: sortValue})
            .skip(skipValue)
            .limit(filters.pageSize).lean();

        const commentsViewModels: ViewCommentModel[] = foundedPosts.map(mapCommentDbTypeToViewCommentModel);
        const totalCount: number = await CommentModel.countDocuments({postId});
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