import {UserAccountDbType, UserAccountType} from "../types/userTypes";
import {ViewUserModel} from "../models/user/viewUserModel";
import {DeviceDBType, DeviceType} from "../types/deviceTypes";
import {DeviceViewModel} from "../models/auth/device/deviceViewModel";
import {BlogDbType, BlogType} from "../types/blogTypes";
import {ViewBlogModel} from "../models/blog/viewBlogModel";
import {PostDbType, PostType} from "../types/postTypes";
import {ViewPostModel} from "../models/post/viewPostModel";
import {ViewMeModel} from "../models/auth/viewMeModel";
import {CommentDbType, CommentType} from "../types/commentTypes";
import {ViewCommentModel} from "../models/comment/viewCommentModel";
import {UserActionsDbType, UserActionsType} from "../types/userActionTypes";

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
        createdAt: dbBlog.createdAt,
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
        createdAt: dbPost.createdAt
    }
}

export const mapUserAccountTypeToMeViewModel = (user: UserAccountType | UserAccountDbType): ViewMeModel => {
    return {
        email: user.accountData.email,
        login: user.accountData.login,
        userId: user.id
    }
}

export const mapCommentDbTypeToViewCommentModel = (dbComment: CommentDbType): ViewCommentModel => {
    return {
        id: dbComment.id,
        content: dbComment.content,
        createdAt: dbComment.createdAt,
        userId: dbComment.userId,
        userLogin: dbComment.userLogin
    }
}

export const mapCommentDbTypeToCommentType = (dbComment: CommentDbType): CommentType => {
    return {
        id: dbComment.id,
        content: dbComment.content,
        createdAt: dbComment.createdAt,
        userId: dbComment.userId,
        userLogin: dbComment.userLogin
    }
}

export const mapBlogDBTypeToBlogType = (dbBlog: BlogDbType): BlogType => {
    return {
        id: dbBlog.id,
        name: dbBlog.name,
        websiteUrl: dbBlog.websiteUrl,
        createdAt: dbBlog.createdAt,
        description: dbBlog.description
    }
}

export const mapPostDbTypeToPostType = (dbPost: PostDbType): PostType => {
    return {
        id: dbPost.id,
        blogId: dbPost.blogId,
        content: dbPost.content,
        createdAt: dbPost.createdAt,
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