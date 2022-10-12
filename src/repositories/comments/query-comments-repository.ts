import {commentsCollection, postsCollection} from "../db";
import {ViewCommentModel} from "../../models/comment/view-comment-model";
import {FilterType, Paginator} from "../../types/types";
import {getFilters, getPagesCount, getSkipValue, getSortValue} from "../../helpers/helpers";
import {QueryCommentModel} from "../../models/comment/query-comment-model";
import {CommentDbType} from "../../types/comment-types";

export const commentsQueryRepository = {
    async findCommentById(id: string): Promise<ViewCommentModel | null> {
        const dbComment: CommentDbType | null = await commentsCollection.findOne({id: id});
        if (!dbComment) return null;
        return this._mapCommentDbTypeToViewCommentModel(dbComment);
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

        const commentsViewModels: ViewCommentModel[] = foundedPosts.map(this._mapCommentDbTypeToViewCommentModel);
        const totalCount: number = await commentsCollection.countDocuments({postId: postId});
        const pagesCount = getPagesCount(totalCount, filters.pageSize);

        return {
            pagesCount: pagesCount,
            page: filters.pageNumber,
            pageSize: filters.pageSize,
            totalCount: totalCount,
            items: commentsViewModels
        };
    },
    _mapCommentDbTypeToViewCommentModel(dbComment: CommentDbType): ViewCommentModel {
        return {
            id: dbComment.id,
            content: dbComment.content,
            createdAt: dbComment.createdAt,
            userId: dbComment.userId,
            userLogin: dbComment.userLogin
        }
    }
}