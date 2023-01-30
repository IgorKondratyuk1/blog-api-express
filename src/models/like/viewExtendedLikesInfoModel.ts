import {LikeStatusType} from "../../domain/Like/likeTypes";
import {ViewLikeDetailsModel} from "./viewLikeDetailsModel";

export type ViewExtendedLikesInfoModel = {
    likesCount: number,
    dislikesCount: number,
    myStatus: LikeStatusType,
    newestLikes: ViewLikeDetailsModel[]
}