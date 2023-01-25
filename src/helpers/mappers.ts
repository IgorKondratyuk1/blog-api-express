import {ViewUserModel} from "../models/user/viewUserModel";
import {DeviceViewModel} from "../models/auth/device/deviceViewModel";
import {ViewBlogModel} from "../models/blog/viewBlogModel";
import {ViewPostModel} from "../models/post/viewPostModel";
import {ViewMeModel} from "../models/auth/viewMeModel";
import {ViewCommentModel} from "../models/comment/viewCommentModel";
import {HydratedLike, LikeDbType, LikeStatusType, LikeType} from "../01_domain/Like/likeTypes";
import {CommentDbType, CommentType, HydratedComment} from "../01_domain/Comment/commentTypes";
import {BlogDbType, BlogType, HydratedBlog} from "../01_domain/Blog/blogTypes";
import {HydratedPost, PostDbType, PostType} from "../01_domain/Post/postTypes";
import {HydratedUser, UserAccountDbType, UserAccountType} from "../01_domain/User/UserTypes";
import {DeviceDbType, DeviceType, HydratedDevice} from "../01_domain/Security/securityTypes";
import {HydrateUserAction, UserActionsDbType, UserActionsType} from "../01_domain/UserAction/userActionTypes";
import {ViewLikeDetailsModel} from "../models/like/viewLikeDetailsModel";

export const mapUserAccountTypeToViewUserModel = (dbUser: UserAccountType | UserAccountDbType | HydratedUser): ViewUserModel => {
    return {
        id: dbUser.id,
        login: dbUser.accountData.login,
        email: dbUser.accountData.email,
        createdAt: dbUser.accountData.createdAt
    }
}

export const mapDeviceDBTypeToDeviceViewModel = (dbDevice: DeviceDbType | DeviceType | HydratedDevice): DeviceViewModel => {
    return {
        ip: dbDevice.ip,
        deviceId: dbDevice.deviceId,
        title: dbDevice.title,
        lastActiveDate: dbDevice.issuedAt
    }
}

export const mapDeviceDBTypeToDeviceType = (dbDevice: DeviceDbType | HydratedDevice): DeviceType => {
    return {
        expiredAt: dbDevice.expiredAt,
        userId: dbDevice.userId,
        isValid: dbDevice.isValid,
        ip: dbDevice.ip,
        deviceId: dbDevice.deviceId,
        title: dbDevice.title,
        issuedAt: dbDevice.issuedAt
    }
}

export const mapBlogTypeToBlogViewModel = (dbBlog: BlogType | HydratedBlog): ViewBlogModel => {
    return {
        id: dbBlog.id,
        name: dbBlog.name,
        websiteUrl: dbBlog.websiteUrl,
        createdAt: new Date(dbBlog.createdAt).toISOString(),
        description: dbBlog.description
    }
}

// export const mapPostTypeToPostViewModel = (dbPost: PostType | HydratedPost): ViewPostModel => {
//     return {
//         id:	dbPost.id,
//         title: dbPost.title,
//         shortDescription: dbPost.shortDescription,
//         content: dbPost.content,
//         blogId:	dbPost.blogId,
//         blogName: dbPost.blogName,
//         createdAt: new Date(dbPost.createdAt).toISOString()
//     }
// }

export const mapUserAccountTypeToMeViewModel = (user: UserAccountType | UserAccountDbType | HydratedUser): ViewMeModel => {
    return {
        email: user.accountData.email,
        login: user.accountData.login,
        userId: user.id
    }
}

export const mapCommentDbTypeToViewCommentModel = (dbComment: CommentDbType | CommentType | HydratedComment, likeStatus: LikeStatusType): ViewCommentModel => {
    return {
        id: dbComment.id,
        content: dbComment.content,
        createdAt: new Date(dbComment.createdAt).toISOString(),
        userId: dbComment.userId,
        userLogin: dbComment.userLogin,
        likesInfo: {
            likesCount: dbComment.likesInfo.likesCount,
            dislikesCount: dbComment.likesInfo.dislikesCount,
            myStatus: likeStatus
        }
    }
}

export const mapCommentDbTypeToCommentType = (dbComment: CommentDbType | HydratedComment): CommentType => {
    return {
        id: dbComment.id,
        content: dbComment.content,
        createdAt: dbComment.createdAt,
        updatedAt: dbComment.updatedAt,
        userId: dbComment.userId,
        userLogin: dbComment.userLogin,
        likesInfo: {
            likesCount: dbComment.likesInfo.likesCount,
            dislikesCount: dbComment.likesInfo.dislikesCount
        }
    }
}

export const mapBlogDBTypeToBlogType = (dbBlog: BlogDbType | HydratedBlog): BlogType => {
    return {
        id: dbBlog.id,
        name: dbBlog.name,
        websiteUrl: dbBlog.websiteUrl,
        createdAt: dbBlog.createdAt,
        updatedAt: dbBlog.updatedAt,
        description: dbBlog.description
    }
}

// export const mapPostDbTypeToPostType = (dbPost: PostDbType | HydratedPost): PostType => {
//     return {
//         id: dbPost.id,
//         blogId: dbPost.blogId,
//         content: dbPost.content,
//         createdAt: dbPost.createdAt,
//         updatedAt: dbPost.updatedAt,
//         shortDescription: dbPost.shortDescription,
//         title: dbPost.title,
//         blogName: dbPost.blogName
//     }
// }

export const mapUserAccountDbTypeToViewUserModel = (dbUser: UserAccountDbType): ViewUserModel => {
    return {
        id: dbUser.id,
        email: dbUser.accountData.email,
        login: dbUser.accountData.login,
        createdAt: dbUser.accountData.createdAt
    }
}

export const mapUserActionsDbTypeToUserActionsType = (dbAction: UserActionsDbType | HydrateUserAction): UserActionsType => {
    return {
        ip: dbAction.ip,
        lastActiveDate: dbAction.lastActiveDate,
        resource: dbAction.resource
    }
}

export const mapUserAccountDBTypeToUserAccountType = (dbUser: UserAccountDbType | HydratedUser): UserAccountType => {
    return {
        id: dbUser.id,
        accountData: {
            login: dbUser.accountData.login,
            email: dbUser.accountData.email,
            createdAt: dbUser.accountData.createdAt,
            passwordHash: dbUser.accountData.passwordHash
        },
        emailConfirmation: {
            confirmationCode: dbUser.emailConfirmation.confirmationCode,
            isConfirmed: dbUser.emailConfirmation.isConfirmed,
            expirationDate: dbUser.emailConfirmation.expirationDate
        },
        passwordRecovery: {
            expirationDate: dbUser.passwordRecovery.expirationDate,
            isUsed: dbUser.passwordRecovery.isUsed,
            recoveryCode: dbUser.passwordRecovery.recoveryCode
        },
        createdAt: dbUser.createdAt,
        updatedAt: dbUser.updatedAt
    }
}

export const mapLikeDbTypeToLikeType = (dbLike: LikeDbType | HydratedLike): LikeType => {
    return {
        locationId: dbLike.locationId,
        userId: dbLike.userId,
        locationName: dbLike.locationName,
        myStatus: dbLike.myStatus,
        createdAt: dbLike.createdAt,
        updatedAt: dbLike.updatedAt,
        userLogin: dbLike.userLogin
    }
}



export const mapPostTypeToPostViewModel = (dbPost: PostDbType | PostType | HydratedPost, likeStatus: LikeStatusType, lastLikes: LikeDbType[] | null): ViewPostModel => {
    let newestLikes: ViewLikeDetailsModel[] = [];

    if (lastLikes) {
        for (let i = 0; i < lastLikes.length; i++) {
            let newestLike: ViewLikeDetailsModel = {
                login: lastLikes[i].userLogin,
                userId: lastLikes[i].userId,
                addedAt: new Date(lastLikes[i].updatedAt).toISOString()
            };

            newestLikes.push(newestLike);
        }
    }

    return {
        id: dbPost.id,
        blogId: dbPost.blogId,
        content: dbPost.content,
        createdAt: new Date(dbPost.createdAt).toISOString(),
        blogName: dbPost.blogName,
        title: dbPost.title,
        shortDescription: dbPost.shortDescription,
        extendedLikesInfo: {
            likesCount: dbPost.extendedLikesInfo.likesCount,
            dislikesCount: dbPost.extendedLikesInfo.dislikesCount,
            myStatus: likeStatus,
            newestLikes: newestLikes
        }
    }
}