import {ViewUserModel} from "../models/user/viewUserModel";
import {DeviceViewModel} from "../models/auth/device/deviceViewModel";
import {ViewBlogModel} from "../models/blog/viewBlogModel";
import {ViewPostModel} from "../models/post/viewPostModel";
import {ViewMeModel} from "../models/auth/viewMeModel";
import {ViewCommentModel} from "../models/comment/viewCommentModel";
import {BlogDbType, BlogType} from "../repositories/blogs/blogSchema";
import {CommentDbType, CommentType} from "../repositories/comments/commentSchema";
import {PostDbType, PostType} from "../repositories/posts/postSchema";
import {UserAccountDbType, UserAccountType} from "../repositories/users/userSchema";
import {DeviceDBType, DeviceType} from "../repositories/security/securitySchema";
import {UserActionsDbType, UserActionsType} from "../repositories/userActions/userActionSchema";
import {LikeDbType, LikeStatusType, LikeType} from "../repositories/likes/likeSchema";

export const mapUserAccountTypeToViewUserModel = (dbUser: UserAccountType | UserAccountDbType): ViewUserModel => {
    return {
        id: dbUser.id,
        login: dbUser.accountData.login,
        email: dbUser.accountData.email,
        createdAt: dbUser.accountData.createdAt
    }
}

export const mapDeviceDBTypeToDeviceViewModel = (dbDevice: DeviceDBType | DeviceType): DeviceViewModel => {
    return {
        ip: dbDevice.ip,
        deviceId: dbDevice.deviceId,
        title: dbDevice.title,
        lastActiveDate: dbDevice.issuedAt
    }
}

export const mapDeviceDBTypeToDeviceType = (dbDevice: DeviceDBType): DeviceType => {
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

export const mapBlogTypeToBlogViewModel = (dbBlog: BlogType): ViewBlogModel => {
    return {
        id: dbBlog.id,
        name: dbBlog.name,
        websiteUrl: dbBlog.websiteUrl,
        createdAt: new Date(dbBlog.createdAt).toISOString(),
        description: dbBlog.description
    }
}

export const mapPostTypeToPostViewModel = (dbPost: PostType): ViewPostModel => {
    return {
        id:	dbPost.id,
        title: dbPost.title,
        shortDescription: dbPost.shortDescription,
        content: dbPost.content,
        blogId:	dbPost.blogId,
        blogName: dbPost.blogName,
        createdAt: new Date(dbPost.createdAt).toISOString()
    }
}

export const mapUserAccountTypeToMeViewModel = (user: UserAccountType | UserAccountDbType): ViewMeModel => {
    return {
        email: user.accountData.email,
        login: user.accountData.login,
        userId: user.id
    }
}

export const mapCommentDbTypeToViewCommentModel = (dbComment: CommentDbType | CommentType, likeStatus: LikeStatusType): ViewCommentModel => {
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

export const mapCommentDbTypeToCommentType = (dbComment: CommentDbType): CommentType => {
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

export const mapBlogDBTypeToBlogType = (dbBlog: BlogDbType): BlogType => {
    return {
        id: dbBlog.id,
        name: dbBlog.name,
        websiteUrl: dbBlog.websiteUrl,
        createdAt: dbBlog.createdAt,
        updatedAt: dbBlog.updatedAt,
        description: dbBlog.description
    }
}

export const mapPostDbTypeToPostType = (dbPost: PostDbType): PostType => {
    return {
        id: dbPost.id,
        blogId: dbPost.blogId,
        content: dbPost.content,
        createdAt: dbPost.createdAt,
        updatedAt: dbPost.updatedAt,
        shortDescription: dbPost.shortDescription,
        title: dbPost.title,
        blogName: dbPost.blogName
    }
}

export const mapUserAccountDbTypeToViewUserModel = (dbUser: UserAccountDbType): ViewUserModel => {
    return {
        id: dbUser.id,
        email: dbUser.accountData.email,
        login: dbUser.accountData.login,
        createdAt: dbUser.accountData.createdAt
    }
}

export const mapUserActionsDbTypeToUserActionsType = (dbAction: UserActionsDbType): UserActionsType => {
    return {
        ip: dbAction.ip,
        lastActiveDate: dbAction.lastActiveDate,
        resource: dbAction.resource
    }
}

export const mapUserAccountDBTypeToUserAccountType = (dbUser: UserAccountDbType): UserAccountType => {
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

export const mapLikeDbTypeToLikeType = (dbLike: LikeDbType): LikeType => {
    return {
        locationId: dbLike.locationId,
        userId: dbLike.userId,
        locationName: dbLike.locationName,
        myStatus: dbLike.myStatus,
        createdAt: dbLike.createdAt,
        updatedAt: dbLike.updatedAt
    }
}