import {WithId} from "mongodb";
import {HydratedDocument} from "mongoose";
import {LikeLocationsType, LikeStatusType} from "./likeTypes";

// export type ViewLikeDetailsModel = {
//     addedAt: string,
//     userId: string,
//     login: string
// }
//
// export type LikeType = {
//     userId: string
//     locationId: string
//     locationName: LikeLocationsType
//     myStatus: LikeStatusType
//     createdAt: Date
//     updatedAt: Date
// }
// export type LikeDbType = WithId<{
//     id: string
//     userId: string
//     locationId: string
//     locationName: LikeLocationsType
//     myStatus: LikeStatusType
//     createdAt: Date
//     updatedAt: Date
// }>;