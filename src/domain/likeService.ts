import {LikesRepository} from "../repositories/likes/likesRepository";
import {
    CreateLikeDbType, LikeLocationsType,
    LikeStatus,
    LikeStatusType,
} from "../repositories/likes/likeSchema";
import {v4 as uuidv4} from "uuid";

export enum LikeError {
    Success,
    UpdateError,
    NotFoundError
}

export class LikeService {
    constructor(protected likesRepository: LikesRepository) {}

    async like(userId: string, locationName: LikeLocationsType, locationId: string, status: LikeStatusType): Promise<LikeError> {
        switch (status) {
            case "Like":
            case "Dislike":
                const updateResult: LikeError = await this.createOrUpdateLike(userId,locationName, locationId, status);
                return updateResult;
                break;
            case "None":
                const deleteResult: LikeError = await this.deleteLike(userId, locationName, locationId);
                return deleteResult;
                break;
            default:
                return LikeError.NotFoundError;
        }
    }

    async createOrUpdateLike(userId: string, locationName: LikeLocationsType, locationId: string, status: LikeStatusType): Promise<LikeError> {
        // 1. Find like status
        const findLike: LikeStatusType = await this.likesRepository.getUserLikeStatus(userId, locationId, locationName);

        // 2. If likeStatus === "None": create new likeObject
        //    Else: update existing likeObject status
        let result: boolean;
        if (findLike === LikeStatus.None) {
            const newLike: CreateLikeDbType = {
                id: uuidv4(),
                myStatus: status,
                userId,
                locationId,
                locationName
            }
            result = await this.likesRepository.createLike(newLike);
        } else {
            result = await this.likesRepository.updateLike(locationId, locationName, userId, status);
        }

        if (!result) return LikeError.UpdateError;
        return LikeError.Success
    }

    async deleteLike(userId: string, locationName: LikeLocationsType, locationId: string): Promise<LikeError> {
        const result: boolean = await this.likesRepository.deleteLike(locationId, locationName, userId);
        if (!result) return LikeError.UpdateError;
        return LikeError.Success;
    }

    async deleteLikesOfLocation(locationName: LikeStatusType, locationId: string) {
        const result: boolean = await this.likesRepository.deleteLikesOfLocation(locationId, locationName);
        if (!result) return false;
        return true;
    }
}