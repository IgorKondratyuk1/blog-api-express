import mongoose from "mongoose";
import {WithId} from "mongodb";

export enum LikeStatus {
    None = "None",
    Like = "Like",
    Dislike = "Dislike"
}

export enum LikeLocation {
    Comment = "Comment",
}

export type LikeStatusType = keyof typeof LikeStatus;
export type LikeLocationsType = keyof typeof LikeLocation;

export type LikeType = {
    userId: string
    locationId: string
    locationName: LikeLocationsType
    myStatus: LikeStatusType
    createdAt: Date
    updatedAt: Date
}

export type LikeDbType = WithId<{
    id: string
    userId: string
    locationId: string
    locationName: LikeLocationsType
    myStatus: LikeStatusType
    createdAt: Date
    updatedAt: Date
}>;

export type CreateLikeDbType = {
    id: string
    userId: string
    locationId: string
    locationName: LikeLocationsType
    myStatus: LikeStatusType
};

export const likeSchema = new mongoose.Schema<LikeDbType>({
    id: {type: String, required: true},
    userId: {type: String, required: true},
    locationId: {type: String, required: true},
    locationName: {type: String, enum: LikeLocation, default: LikeLocation.Comment, required: true},
    myStatus: {type: String, enum: LikeStatus, default: LikeStatus.None, required: true}
}, {timestamps: true, optimisticConcurrency: true});

export const LikeModel = mongoose.model('Like', likeSchema);