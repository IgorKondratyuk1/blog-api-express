import {LikeStatusType} from "../../repositories/likes/likeSchema";

export type ViewLikeModel = {
    likesCount: number
    dislikesCount: number
    myStatus: LikeStatusType
}