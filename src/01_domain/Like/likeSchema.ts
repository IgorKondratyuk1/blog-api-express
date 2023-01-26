import mongoose, {Model} from "mongoose";
import {
    HydratedLike,
    LikeDbMethodsType,
    LikeDbType,
    LikeLocation,
    LikeLocationsType,
    LikeStatus,
    LikeStatusType
} from "./likeTypes";
import {v4 as uuidv4} from "uuid";

export type LikeModel = Model<LikeDbType, {}, LikeDbMethodsType> & {
    createInstance(userId: string, userLogin: string, locationName: LikeLocationsType, locationId: string, status: LikeStatusType): Promise<HydratedLike>,
    getLikesOrDislikesCount(locationId: string, locationName: string, status: LikeStatusType): Promise<number>,
    getUserLikeStatus(userId: string, locationId: string, locationName: LikeLocationsType): Promise<LikeStatusType>
}

export const likeSchema = new mongoose.Schema<LikeDbType, LikeModel, LikeDbMethodsType>({
    id: {type: String, required: true},
    userId: {type: String, required: true},
    userLogin: {type: String, required: true},
    locationId: {type: String, required: true},
    locationName: {type: String, enum: LikeLocation, default: LikeLocation.Comment, required: true},
    myStatus: {type: String, enum: LikeStatus, default: LikeStatus.None, required: true}
}, {timestamps: true, optimisticConcurrency: true});

likeSchema.method("setStatus", function setStatus(status: LikeStatusType) {
    const like = this as LikeDbType & LikeDbMethodsType;
    //if (like.myStatus === status) throw new Error("Like status can not be changed to the same value");
    like.myStatus = status;
});

likeSchema.static('createInstance', async function createInstance(userId: string, userLogin: string, locationName: LikeLocationsType, locationId: string, status: LikeStatusType) {
    const newLike = new Like({
        id: uuidv4(),
        myStatus: status,
        userId,
        userLogin,
        locationId,
        locationName
    });
    return this.create(newLike);
});

likeSchema.static('getLikesOrDislikesCount', async function getLikesOrDislikesCount(locationId: string, locationName: string, status: LikeStatusType) {
    const count: number = await Like.countDocuments({locationId, locationName, myStatus: status});
    return count;
});

likeSchema.static('getUserLikeStatus', async function getUserLikeStatus(userId: string, locationId: string, locationName: LikeLocationsType) {
    if (!userId) return LikeStatus.None;

    const like: HydratedLike | null = await Like.findOne({userId, locationId, locationName});
    return like ? like.myStatus : LikeStatus.None;
});

export const Like = mongoose.model<LikeDbType, LikeModel>('Like', likeSchema);