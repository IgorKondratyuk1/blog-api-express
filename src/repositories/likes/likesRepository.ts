import {CreateLikeDbType, LikeDbType, LikeModel, LikeStatus, LikeStatusType} from "./likeSchema";
import {DeleteResult} from "mongodb";

export class LikesRepository {
    async getUserLikeStatus(userId: string, locationId: string, locationName: string): Promise<LikeStatusType> {
        const dbLike: LikeDbType | null = await LikeModel.findOne({userId, locationId, locationName});
        if (!dbLike) return LikeStatus.None;
        return dbLike.myStatus;
    }

    async createLike(like: CreateLikeDbType): Promise<boolean> {
        try {
            const result: LikeDbType | null = await LikeModel.create(like);

            console.log("Create like result:");
            console.log(result);

            if (!result) return false;

            return true
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateLike(locationId: string, locationName: string, userId: string, status: LikeStatusType): Promise<boolean> {
        try {
            const like = await LikeModel.findOne({userId, locationId, locationName});
            if (!like) return false;

            like.myStatus = status;
            await like.save();

            return true
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async getLikesDislikesCount(locationId: string, locationName: string, status: LikeStatusType): Promise<number | null> {
        try {
            const count: number = await LikeModel.countDocuments({locationId, locationName, myStatus: status});
            return count;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async deleteLike(locationId: string, locationName: string, userId: string): Promise<boolean> {
        try {
            const result: DeleteResult = await LikeModel.deleteOne({userId, locationId, locationName});
            if (!result) return false;

            return result.deletedCount === 1;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async deleteLikesOfLocation(locationId: string, locationName: string): Promise<boolean> {
        try {
            const result: DeleteResult = await LikeModel.deleteMany({locationId, locationName});
            if (!result) return false;

            return result.deletedCount >= 0;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async deleteAllLikes() {
        try {
            return await LikeModel.deleteMany({});
        } catch (error) {
            console.log(error);
        }
    }
}