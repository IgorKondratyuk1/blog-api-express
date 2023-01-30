import {LikeStatusType} from "../../domain/Like/likeTypes";

export type ViewLikeModel = {
    likesCount: number
    dislikesCount: number
    myStatus: LikeStatusType
}