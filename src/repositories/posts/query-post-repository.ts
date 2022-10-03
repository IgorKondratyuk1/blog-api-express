import {postsCollection} from "../db";
import {FilterType, Paginator, PostType} from "../../types/types";
import {ViewPostModel} from "../../models/post/view-post-model";
import {getPostViewModel} from "../../helpers/helpers";

export const postsQueryRepository = {
    async findPosts(filters: FilterType): Promise<Paginator<PostType>> {
        const {pageSize, pageNumber, sortBy, sortDirection} = filters;
        const skipValue = (pageNumber - 1) * pageSize;
        const sortValue = sortDirection === "asc" ? 1 : -1;
        //const searchNameTermValue = searchNameTerm || "";

        const foundedPosts: PostType[] = await postsCollection.find({}).sort({[sortBy]: sortValue}).skip(skipValue).limit(pageSize).toArray();
        const postsViewModels: ViewPostModel[] = foundedPosts.map(getPostViewModel); // Get Output/View models of Posts via mapping
        const totalCount: number = await postsCollection.countDocuments();

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: postsViewModels
        };
    },
    async findPostById(id: string): Promise<PostType | null> {
        return postsCollection.findOne({id: id});
    },

    // TODO refactore
    async findPostOfBlog(filters: FilterType, blogId: string): Promise<Paginator<ViewPostModel>> {
        const {pageSize, pageNumber, sortBy, sortDirection} = filters;
        const skipValue = (pageNumber - 1) * pageSize;
        const sortValue = sortDirection === "asc" ? 1 : -1;
        //const searchNameTermValue = searchNameTerm || "";

        const foundedPosts: PostType[] = await postsCollection.find({blogId: blogId}).sort({[sortBy]: sortValue}).skip(skipValue).limit(pageSize).toArray();
        const postsViewModels: ViewPostModel[] = foundedPosts.map(getPostViewModel); // Get Output/View models of Posts via mapping
        const totalCount: number = await postsCollection.countDocuments({blogId: blogId});

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: postsViewModels
        };
    }
}