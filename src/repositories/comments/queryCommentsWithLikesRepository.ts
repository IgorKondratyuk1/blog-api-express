import {FilterType, Paginator} from "../../types/types";
import {getFilters, getPagesCount, getSkipValue, getSortValue} from "../../helpers/helpers";
import {ViewCommentModel} from "../../models/comment/viewCommentModel";
import {QueryCommentModel} from "../../models/comment/queryCommentModel";
import {mapCommentDbTypeToViewCommentModel} from "../../helpers/mappers";
import {CommentDbType, CommentModel} from "./commentSchema";
import {LikesRepository} from "../likes/likesRepository";
import {LikeLocation, LikeStatusType, LikeType} from "../likes/likeSchema";

export class CommentsWithLikesQueryRepository {
    constructor(
        protected likesRepository: LikesRepository
    ) {}

    async findCommentById(commentId: string, userId: string): Promise<ViewCommentModel | null> {
        const dbComment: CommentDbType | null = await CommentModel.findOne({id: commentId});
        if (!dbComment) return null;

        const likeStatus: LikeStatusType = await this.likesRepository.getUserLikeStatus(userId, commentId, LikeLocation.Comment);

        return mapCommentDbTypeToViewCommentModel(dbComment, likeStatus);
    }

    async findCommentsOfPost(currentUserId: string, postId: string, queryObj: QueryCommentModel): Promise<Paginator<ViewCommentModel>> {
        const filters: FilterType = getFilters(queryObj);
        const skipValue: number = getSkipValue(filters.pageNumber, filters.pageSize);
        const sortValue: 1 | -1 = getSortValue(filters.sortDirection);

        const foundedComments: CommentDbType[] = await CommentModel
            .find({postId})
            .sort({[filters.sortBy]: sortValue})
            .skip(skipValue)
            .limit(filters.pageSize).lean();

        const commentsViewModels: ViewCommentModel[] = await Promise.all(foundedComments.map(async (comment: CommentDbType) => {
            const likeStatus: LikeStatusType = await this.likesRepository.getUserLikeStatus(currentUserId, comment.id, LikeLocation.Comment);
            return mapCommentDbTypeToViewCommentModel(comment, likeStatus);
        }));

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