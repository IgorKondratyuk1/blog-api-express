import {FilterType, Paginator} from "../../types/types";
import {getFilters, getPagesCount, getSkipValue, getSortValue} from "../../helpers/helpers";
import {QueryPostModel} from "../../models/post/queryPostModel";
import {ViewPostModel} from "../../models/post/viewPostModel";
import {mapPostTypeToPostViewModel} from "../../helpers/mappers";
import {Post} from "../../domain/Post/postSchema";
import {inject, injectable} from "inversify";
import {HydratedPost, PostDbType, PostType} from "../../domain/Post/postTypes";
import {LikesRepository} from "../likes/likesRepository";
import {LikeDbType, LikeLocation, LikeStatusType} from "../../domain/Like/likeTypes";
import {Like} from "../../domain/Like/likeSchema";

@injectable()
export class PostsQueryRepository {
    constructor(
        @inject(LikesRepository) protected likesRepository: LikesRepository,
    ) {}

    async findPostById(postId: string, userId: string): Promise<ViewPostModel | null> {
        const lastLikes: LikeDbType[] | null = await this.likesRepository.getLastLikesInfo(postId, LikeLocation.Post, 3);
        const post: HydratedPost | null = await Post.findOne({id: postId});
        if (!post) return null;

        const likeStatus: LikeStatusType = await Like.getUserLikeStatus(userId, postId, LikeLocation.Post);
        return mapPostTypeToPostViewModel(post, likeStatus, lastLikes);
    }

    async findPosts(currentUserId: string, queryObj: QueryPostModel): Promise<Paginator<ViewPostModel>> {
        const filters: FilterType = getFilters(queryObj);
        const skipValue: number = getSkipValue(filters.pageNumber, filters.pageSize);
        const sortValue: 1 | -1 = getSortValue(filters.sortDirection);

        const foundedPosts: PostDbType[] = await Post
            .find({})
            .sort({[filters.sortBy]: sortValue})
            .skip(skipValue)
            .limit(filters.pageSize)
            .lean();

        const postsViewModels: ViewPostModel[] = await Promise.all(foundedPosts.map(async (post: PostDbType) => {
            const likeStatus: LikeStatusType = await Like.getUserLikeStatus(currentUserId, post.id, LikeLocation.Post);
            const lastLikes: LikeDbType[] | null = await this.likesRepository.getLastLikesInfo(post.id, LikeLocation.Post, 3);
            return mapPostTypeToPostViewModel(post, likeStatus, lastLikes);
        }));
        const totalCount: number = await Post.countDocuments();
        const pagesCount = getPagesCount(totalCount, filters.pageSize);

        return {
            pagesCount: pagesCount,
            page: filters.pageNumber,
            pageSize: filters.pageSize,
            totalCount: totalCount,
            items: postsViewModels
        };
    }

    async findPostsOfBlog(blogId: string, currentUserId: string, queryObj: QueryPostModel): Promise<Paginator<ViewPostModel>> {
        const filters: FilterType = getFilters(queryObj);
        const skipValue: number = getSkipValue(filters.pageNumber, filters.pageSize);
        const sortValue: 1 | -1 = getSortValue(filters.sortDirection);

        const foundedPosts: PostDbType[] = await Post
            .find({blogId: blogId})
            .sort({[filters.sortBy]: sortValue})
            .skip(skipValue)
            .limit(filters.pageSize)
            .lean();

        const postsViewModels: ViewPostModel[] = await Promise.all(foundedPosts.map(async (post: PostDbType) => {
            const likeStatus: LikeStatusType = await Like.getUserLikeStatus(currentUserId, post.id, LikeLocation.Post);
            const lastLikes: LikeDbType[] | null = await this.likesRepository.getLastLikesInfo(post.id, LikeLocation.Post, 3);
            return mapPostTypeToPostViewModel(post, likeStatus, lastLikes);
        }));
        const totalCount: number = await Post.countDocuments({blogId: blogId});
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