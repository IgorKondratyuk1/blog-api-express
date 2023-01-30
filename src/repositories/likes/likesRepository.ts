import {Like} from "../../domain/Like/likeSchema";
import {DeleteResult} from "mongodb";
import {injectable} from "inversify";
import {HydratedLike, LikeDbType} from "../../domain/Like/likeTypes";

@injectable()
export class LikesRepository {
    async save(like: HydratedLike) {
        await like.save();
    }
    async getUserLike(userId: string, locationId: string, locationName: string): Promise<HydratedLike | null> {
        const dbLike: HydratedLike | null = await Like.findOne({userId, locationId, locationName});
        return dbLike;
    }
    async getLastLikesInfo(locationId: string, locationName: string, limitCount: number): Promise<LikeDbType[] | null> {
        const dbLikes: LikeDbType[] | null = await Like.find({locationId, locationName, myStatus: "Like"}).sort({updatedAt: -1}).limit(limitCount).lean();
        return dbLikes;
    }
    async deleteLike(locationId: string, locationName: string, userId: string): Promise<boolean> {
        try {
            const result: DeleteResult = await Like.deleteOne({userId, locationId, locationName});
            if (!result) return false;

            return result.deletedCount === 1;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async deleteLikesOfLocation(locationId: string, locationName: string): Promise<boolean> {
        try {
            const result: DeleteResult = await Like.deleteMany({locationId, locationName});
            if (!result) return false;

            return result.deletedCount >= 0;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async deleteAllLikes() {
        try {
            return await Like.deleteMany({});
        } catch (error) {
            console.log(error);
        }
    }
}