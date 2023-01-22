import {basicAuthValue, clearDB, usersPassword} from "./helpers/helpers";
import request from "supertest";
import {app} from "../../index";
import {CreateUserModel} from "../../models/user/createUserModel";
import {ViewUserModel} from "../../models/user/viewUserModel";
import {LoginInputModel} from "../../models/auth/login/loginInputModel";
import {CreateBlogModel} from "../../models/blog/createBlogModel";
import {ViewBlogModel} from "../../models/blog/viewBlogModel";
import {CreatePostModel} from "../../models/post/createPostModel";
import {ViewPostModel} from "../../models/post/viewPostModel";
import {CreateCommentModel} from "../../models/comment/createCommentModel";
import {ViewCommentModel} from "../../models/comment/viewCommentModel";
import {LikeStatus} from "../../repositories/likes/likeSchema";
import {UpdateLikeModel} from "../../models/like/updateLikeModel";

// Testing: Comments Likes
describe("/comments/like-status", () => {
    let jwtToken: string = '';

    let firstComment: any = null;
    let firstUser: any = null;
    let secondUser: any = null;

    //Clear DB
    beforeAll(async () => {
        await clearDB();
    });

    // --------- Prepare Data ---------
    // Create first User
    it("POST: should create first user", async () => {
        const data: CreateUserModel = {
            email: "testUser1@gmail.com",
            login: "test1",
            password: usersPassword
        };

        const result = await request(app)
            .post("/api/users")
            .set("Authorization", basicAuthValue)
            .send(data);

        firstUser = result.body;

        expect(result.status).toBe(201);
        const expectedObj: ViewUserModel = {
            id: expect.any(String),
            login: data.login,
            email: data.email,
            createdAt: expect.any(String)
        };
        expect(result.body).toEqual(expectedObj);
    });

    // Create second User
    it("POST: should create second user", async () => {
        const data: CreateUserModel = {
            email: "testUser2@gmail.com",
            login: "test2",
            password: usersPassword
        };

        const result = await request(app)
            .post("/api/users")
            .set("Authorization", basicAuthValue)
            .send(data);

        secondUser = result.body;

        expect(result.status).toBe(201);
        const expectedObj: ViewUserModel = {
            id: expect.any(String),
            login: data.login,
            email: data.email,
            createdAt: expect.any(String)
        };
        expect(result.body).toEqual(expectedObj);
    });

    it("POST: should login using first User", async () => {
        const data: LoginInputModel = {
            loginOrEmail: firstUser.login,
            password: usersPassword
        };

        const result = await request(app)
            .post("/api/auth/login")
            .set("Authorization", basicAuthValue)
            .send(data)
            .expect(200);

        expect(result.body).toEqual({
            accessToken: expect.any(String)
        });

        jwtToken = result.body.accessToken;
    });

    it("GET: check current (firstUser) user data", async () => {
        const result = await request(app)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${jwtToken}`)
            .expect(200);

        expect(result.body).toEqual({
            email: firstUser.email,
            login: firstUser.login,
            userId: expect.any(String)
        });
    });

    // Create Blog
    let firstBlog: any = null;
    it("POST: should create blog", async () => {
        const data: CreateBlogModel = {
            name: "New Blog",
            websiteUrl: "https://www.youtube.com",
            description: "some description"
        };

        const result = await request(app)
            .post("/api/blogs")
            .set("Authorization", basicAuthValue)
            .send(data);

        firstBlog = result.body;

        expect(result.status).toBe(201);
        const expectedObj: ViewBlogModel = {
            id: expect.any(String),
            name: data.name,
            websiteUrl: data.websiteUrl,
            description: data.description,
            createdAt: expect.any(String)
        };
        expect(result.body).toEqual(expectedObj);
    });

    // Create Post
    let firstPost: any = null;
    it("POST: should create post with correct data", async () => {
        const data: CreatePostModel = {
            title: "Correct title",
            shortDescription: "descr",
            content: "content",
            blogId: firstBlog.id
        };

        const result = await request(app)
            .post("/api/posts")
            .set("Authorization", basicAuthValue)
            .send(data);

        firstPost = result.body;

        const expectedObj: ViewPostModel = {
            id: expect.any(String),
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId,
            blogName: expect.any(String),
            createdAt: expect.any(String)
        };
        expect(result.status).toBe(201);
        expect(firstPost).toEqual(expectedObj);
    });

    // Create first comment
    it("POST: should create comment with correct data", async () => {
        const data: CreateCommentModel = {
            content: "firs comment data stringstringstringst"
        };

        const result = await request(app)
            .post(`/api/posts/${firstPost.id}/comments`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send(data)
            .expect(201);

        firstComment = result.body;

        const expectedObj: ViewCommentModel = {
            id: expect.any(String),
            userId: firstUser.id,
            content: data.content,
            createdAt: expect.any(String),
            userLogin: firstUser.login,
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: LikeStatus.None
            }
        };
        expect(firstComment).toEqual(expectedObj);
    });

    // Checking that new post have one comment
    it("GET: should return 1 element. Checking that wrong comments is not created", async () => {
        const result = await request(app)
            .get(`/api/posts/${firstPost.id}/comments`)
            .expect(200);

        expect(result.body.items.length).toBe(1);
        expect(result.body.items[0]).toEqual(firstComment);
    });

    // Put "Like" to comment
    it("PUT: shouldn`t put 'Like' to comment from unauthorized user", async () => {
        const data: UpdateLikeModel = {
            likeStatus: LikeStatus.Like
        };

        await request(app)
            .put(`/api/comments/${firstComment.id}/like-status`)
            .send(data)
            .expect(401);
    });

    it("GET: comment must not have changed", async () => {
        const result = await request(app)
            .get(`/api/comments/${firstComment.id}`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .expect(200);

        expect(result.body).toEqual(firstComment);
    });

    // Put "Like" to comment
    it("PUT: should put 'Like' to comment", async () => {
        const data: UpdateLikeModel = {
            likeStatus: LikeStatus.Like
        };

        await request(app)
            .put(`/api/comments/${firstComment.id}/like-status`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send(data)
            .expect(204);
    });

    it("GET: comment must have likes:1 and myStatus:'Like' when author of like getting comment", async () => {
        const expectedCommentData: ViewCommentModel = {
            ...firstComment,
            likesInfo: {
                dislikesCount: 0,
                likesCount: 1,
                myStatus: LikeStatus.Like
            }
        }

        const result = await request(app)
            .get(`/api/comments/${firstComment.id}`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .expect(200);

        expect(result.body).toEqual(expectedCommentData);
    });

    it("GET: comment must have likes:1 and myStatus:'None' when unknown user getting comment", async () => {
        const expectedCommentData: ViewCommentModel = {
            ...firstComment,
            likesInfo: {
                dislikesCount: 0,
                likesCount: 1,
                myStatus: LikeStatus.None
            }
        }

        const result = await request(app)
            .get(`/api/comments/${firstComment.id}`)
            .expect(200);

        expect(result.body).toEqual(expectedCommentData);
    });

    // Put "Dislike" to comment
    it("PUT: should put 'Like' to comment", async () => {
        const data: UpdateLikeModel = {
            likeStatus: LikeStatus.Dislike
        };

        await request(app)
            .put(`/api/comments/${firstComment.id}/like-status`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send(data)
            .expect(204);
    });

    it("GET: comment must have likes:0, dislikes:1 and myStatus:'Dislike' when author of like getting comment", async () => {
        const expectedCommentData: ViewCommentModel = {
            ...firstComment,
            likesInfo: {
                dislikesCount: 1,
                likesCount: 0,
                myStatus: LikeStatus.Dislike
            }
        }

        const result = await request(app)
            .get(`/api/comments/${firstComment.id}`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .expect(200);

        expect(result.body).toEqual(expectedCommentData);
    });

    it("GET: comment must have likes:0, dislikes:1 and myStatus:'None' when unknown user getting comment", async () => {
        const expectedCommentData: ViewCommentModel = {
            ...firstComment,
            likesInfo: {
                dislikesCount: 1,
                likesCount: 0,
                myStatus: LikeStatus.None
            }
        }

        const result = await request(app)
            .get(`/api/comments/${firstComment.id}`)
            .expect(200);

        expect(result.body).toEqual(expectedCommentData);
    });

    // Put "None" to comment
    it("PUT: should put 'None' to comment", async () => {
        const data: UpdateLikeModel = {
            likeStatus: LikeStatus.None
        };

        await request(app)
            .put(`/api/comments/${firstComment.id}/like-status`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send(data)
            .expect(204);
    });

    it("GET: comment must have likes:0, dislikes:0 and myStatus:'None' when author of like getting comment", async () => {
        const expectedCommentData: ViewCommentModel = {
            ...firstComment,
            likesInfo: {
                dislikesCount: 0,
                likesCount: 0,
                myStatus: LikeStatus.None
            }
        }

        const result = await request(app)
            .get(`/api/comments/${firstComment.id}`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .expect(200);

        expect(result.body).toEqual(expectedCommentData);
    });


    // Put "Like" to comment
    it("PUT: should put 'Like' to comment again", async () => {
        const data: UpdateLikeModel = {
            likeStatus: LikeStatus.Like
        };

        await request(app)
            .put(`/api/comments/${firstComment.id}/like-status`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send(data)
            .expect(204);
    });

    it("GET: comment must have likes:1 and myStatus:'Like' when author of like getting comment again", async () => {
        const expectedCommentData: ViewCommentModel = {
            ...firstComment,
            likesInfo: {
                dislikesCount: 0,
                likesCount: 1,
                myStatus: LikeStatus.Like
            }
        }

        const result = await request(app)
            .get(`/api/comments/${firstComment.id}`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .expect(200);

        expect(result.body).toEqual(expectedCommentData);
        console.log("First user last action");
        console.log(result.body);
    });


    // Second user actions with like
    it("POST: should login using second User", async () => {
        const data: LoginInputModel = {
            loginOrEmail: secondUser.login,
            password: usersPassword
        };

        const result = await request(app)
            .post("/api/auth/login")
            .set("Authorization", basicAuthValue)
            .send(data)
            .expect(200);

        expect(result.body).toEqual({
            accessToken: expect.any(String)
        });

        jwtToken = result.body.accessToken;
    });

    it("GET: check current (secondUser) user data", async () => {
        const result = await request(app)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${jwtToken}`)
            .expect(200);

        expect(result.body).toEqual({
            email: secondUser.email,
            login: secondUser.login,
            userId: expect.any(String)
        });
    });

    // Put "Like" to comment
    it("PUT: should put 'Like' to comment", async () => {
        const data: UpdateLikeModel = {
            likeStatus: LikeStatus.Like
        };

        await request(app)
            .put(`/api/comments/${firstComment.id}/like-status`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send(data)
            .expect(204);
    });

    it("GET: comment must have likes:2 and myStatus:'Like' when second author of like getting comment", async () => {
        const expectedCommentData: ViewCommentModel = {
            ...firstComment,
            likesInfo: {
                dislikesCount: 0,
                likesCount: 2,
                myStatus: LikeStatus.Like
            }
        }

        const result = await request(app)
            .get(`/api/comments/${firstComment.id}`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .expect(200);

        expect(result.body).toEqual(expectedCommentData);
    });

    it("GET: comment must have likes:2 and myStatus:'None' when unknown user getting comment", async () => {
        const expectedCommentData: ViewCommentModel = {
            ...firstComment,
            likesInfo: {
                dislikesCount: 0,
                likesCount: 2,
                myStatus: LikeStatus.None
            }
        }

        const result = await request(app)
            .get(`/api/comments/${firstComment.id}`)
            .expect(200);

        expect(result.body).toEqual(expectedCommentData);
    });

    // Put "Dislike" to comment
    it("PUT: should put 'Dislike' to comment", async () => {
        const data: UpdateLikeModel = {
            likeStatus: LikeStatus.Dislike
        };

        await request(app)
            .put(`/api/comments/${firstComment.id}/like-status`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send(data)
            .expect(204);
    });

    it("GET: comment must have likes:1, dislikes:1 and myStatus:'Dislike' when author of like getting comment", async () => {
        const expectedCommentData: ViewCommentModel = {
            ...firstComment,
            likesInfo: {
                dislikesCount: 1,
                likesCount: 1,
                myStatus: LikeStatus.Dislike
            }
        }

        const result = await request(app)
            .get(`/api/comments/${firstComment.id}`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .expect(200);

        expect(result.body).toEqual(expectedCommentData);
    });

    it("GET: comment must have likes:1, dislikes:1 and myStatus:'None' when unknown user getting comment", async () => {
        const expectedCommentData: ViewCommentModel = {
            ...firstComment,
            likesInfo: {
                dislikesCount: 1,
                likesCount: 1,
                myStatus: LikeStatus.None
            }
        }

        const result = await request(app)
            .get(`/api/comments/${firstComment.id}`)
            .expect(200);

        expect(result.body).toEqual(expectedCommentData);
    });

    // Put "None" to comment
    it("PUT: should put 'None' to comment", async () => {
        const data: UpdateLikeModel = {
            likeStatus: LikeStatus.None
        };

        await request(app)
            .put(`/api/comments/${firstComment.id}/like-status`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send(data)
            .expect(204);
    });

    it("GET: comment must have likes:1, dislikes:0 and myStatus:'None' when author of like getting comment", async () => {
        const expectedCommentData: ViewCommentModel = {
            ...firstComment,
            likesInfo: {
                dislikesCount: 0,
                likesCount: 1,
                myStatus: LikeStatus.None
            }
        }

        const result = await request(app)
            .get(`/api/comments/${firstComment.id}`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .expect(200);

        expect(result.body).toEqual(expectedCommentData);
    });


    // Delete comment
    it("POST: should login using first User", async () => {
        const data: LoginInputModel = {
            loginOrEmail: firstUser.login,
            password: usersPassword
        };

        const result = await request(app)
            .post("/api/auth/login")
            .set("Authorization", basicAuthValue)
            .send(data)
            .expect(200);

        expect(result.body).toEqual({
            accessToken: expect.any(String)
        });

        jwtToken = result.body.accessToken;
    });

    it("DELETE: should delete comment", async () => {
        await request(app)
            .delete(`/api/comments/${firstComment.id}`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .expect(204);
    });

    // Put "Like" to comment
    it("PUT: shouldn`t put 'Like' to deleted comment", async () => {
        const data: UpdateLikeModel = {
            likeStatus: LikeStatus.Like
        };

        await request(app)
            .put(`/api/comments/${firstComment.id}/like-status`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send(data)
            .expect(404);
    });
});