import {LikesRepository} from "../repositories/likes/likesRepository";
import {inject, injectable} from "inversify";
import {HydratedLike, LikeLocationsType, LikeStatusType} from "../domain/Like/likeTypes";
import {Like} from "../domain/Like/likeSchema";

export enum LikeError {
    Success,
    UpdateError,
    NotFoundError,
    WrongUser
}

@injectable()
export class LikeService {
    constructor(
        @inject(LikesRepository) protected likesRepository: LikesRepository
    ) {}

    async like(userId: string, userLogin: string, locationName: LikeLocationsType, locationId: string, status: LikeStatusType): Promise<LikeError> {
        switch (status) {
            case "Like":
            case "Dislike":
                const updateResult: LikeError = await this.createOrUpdateLike(userId, userLogin, locationName, locationId, status);
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
    async createOrUpdateLike(userId: string, userLogin: string, locationName: LikeLocationsType, locationId: string, status: LikeStatusType): Promise<LikeError> {
        try {
            // 1. Find like status
            const foundedLike: HydratedLike | null = await this.likesRepository.getUserLike(userId, locationId, locationName);

            // 2. If like founded: update existing likeObject status
            //    Else: create new likeObject
            if (foundedLike) {
                await foundedLike.setStatus(status);
                await this.likesRepository.save(foundedLike);
            } else {
                await Like.createInstance(userId, userLogin, locationName, locationId, status);
            }

            return LikeError.Success
        } catch (error) {
            console.log(error);
            return LikeError.UpdateError;
        }
    }
    async deleteLike(userId: string, locationName: LikeLocationsType, locationId: string): Promise<LikeError> {
        const result: boolean = await this.likesRepository.deleteLike(locationId, locationName, userId);
        if (!result) return LikeError.UpdateError;
        return LikeError.Success;
    }
}