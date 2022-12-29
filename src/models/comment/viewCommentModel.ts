import {ViewLikeModel} from "../like/viewLikeModel";

export type ViewCommentModel = {
    id: string
    content: string
    userId: string
    userLogin: string
    createdAt: string
    likesInfo: ViewLikeModel
}