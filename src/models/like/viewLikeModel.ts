import {LikeStatusType} from "../../01_domain/Like/likeTypes";

export type ViewLikeModel = {
    likesCount: number
    dislikesCount: number
    myStatus: LikeStatusType
}