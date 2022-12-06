// @ts-ignore
import request from "supertest";
import {CreateUserModel} from "../../models/user/createUserModel";
import {app} from "../../index";
import {ViewUserModel} from "../../models/user/viewUserModel";
import {LoginInputModel} from "../../models/auth/login/loginInputModel";
import {basicAuthValue, clearDB, usersPassword} from "./helpers/helpers";
import {CreateBlogModel} from "../../models/blog/createBlogModel";
import {ViewBlogModel} from "../../models/blog/viewBlogModel";
import {CreatePostModel} from "../../models/post/createPostModel";
import {ViewPostModel} from "../../models/post/viewPostModel";
import {CreateCommentModel} from "../../models/comment/createCommentModel";
import {ViewCommentModel} from "../../models/comment/viewCommentModel";
import {UpdateCommentModel} from "../../models/comment/updateCommentModel";

// Testing: Comments Route
describe("/comments", () => {
    //Clear DB
    beforeAll(async () => {
        await clearDB();
    });

    let jwtToken: string = '';
    let bearerAuth = `Bearer ${jwtToken}`;


    // --------- Prepare Data ---------
    // Create first User
    let firstUser: any = null;
    let firstUserId: string;
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
    let secondUser: any = null;
    let secondUserId: string;
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

    it("Get: get current (firstUser) user data", async () => {
        const result = await request(app)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${jwtToken}`)
            .expect(200);

        expect(result.body).toEqual({
            email: firstUser.email,
            login: firstUser.login,
            userId: expect.any(String)
        });

        firstUserId = result.body.userId;
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

    // --------- POST & Get: Create & Read operations ---------
    // Create first comment
    let firstComment: any = null;
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
            userId: firstUserId,
            content: data.content,
            createdAt: expect.any(String),
            userLogin: firstUser.login
        };
        expect(firstComment).toEqual(expectedObj);
    });

    it("POST: shouldn`t create comment with incorrect data", async () => {
        const data: CreateCommentModel = {
            content: "1"
        };

        const result = await request(app)
            .post(`/api/posts/${firstPost.id}/comments`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send(data)
            .expect(400);

        expect(result.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: "content"
                }
            ]
        });
    });

    it("POST: shouldn`t create comment with incorrect post id", async () => {
        const data: CreateCommentModel = {
            content: "firs comment data stringstringstringst"
        };

        await request(app)
            .post(`/api/posts/123/comments`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send(data)
            .expect(404);
    });

    // Checking that new post have one comment
    it("GET: should return 1 element. Checking that wrong comments is not created", async () => {
        const result = await request(app)
            .get(`/api/posts/${firstPost.id}/comments`)
            .expect(200);

        expect(result.body.items.length).toBe(1);
        expect(result.body.items[0]).toEqual(firstComment);
    });

    it("POST: should create post without Authorization header JWT", async () => {
        const data: CreateCommentModel = {
            content: "firs comment data stringstringstringst"
        };

        await request(app)
            .post(`/api/posts/${firstPost.id}/comments`)
            .send(data)
            .expect(401);

    });

    // --------- PUT: Update operations ---------
    it("PUT: should update post with correct data", async () => {
        const data: UpdateCommentModel = {
            content: "New content correct data str str str str"
        };

        await request(app)
            .put(`/api/comments/${firstComment.id}`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send(data)
            .expect(204);


        // GET:Checking updated post
        const updatedComment = await request(app)
            .get(`/api/comments/${firstComment.id}`);

        const expectedObj: ViewCommentModel = {
            id: expect.any(String),
            content: data.content,
            userId: firstUserId,
            userLogin: firstUser.login,
            createdAt: expect.any(String)
        };
        expect(updatedComment.body).toEqual(expectedObj);
    });

    it("PUT: shouldn`t update comment with incorrect data", async () => {
        const data: UpdateCommentModel = {
            content: '1'
        };

        const response = await request(app)
            .put(`/api/comments/${firstComment.id}`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send(data)
            .expect(400);

        expect(response.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: "content"
                }
            ]
        })
    });

    it("PUT: shouldn`t update comment without jwt token", async () => {
        const data: UpdateCommentModel = {
            content: "New content correct data str str str str"
        };

        await request(app)
            .put(`/api/comments/${firstComment.id}`)
            .send(data)
            .expect(401);
    });

    it("PUT: shouldn`t update not existing comment (id)", async () => {
        const data: UpdateCommentModel = {
            content: "New content correct data str str str str"
        };

        await request(app)
            .put(`/api/comments/111`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send(data)
            .expect(404);
    });

    // --------- Testing Forbidden operations (403) ---------
    // --------- Prepare data ---------
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

    it("Get: get current (secondUser) user data", async () => {
        const result = await request(app)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${jwtToken}`)
            .expect(200);

        expect(result.body).toEqual({
            email: secondUser.email,
            login: secondUser.login,
            userId: expect.any(String)
        });

        secondUserId = result.body.userId;
    });

    // --------- PUT: Testing forbidden update ---------
    const updatingText: string = "Content updated by 2-nd user str str str str";
    it("PUT: shouldn`t update comment of other user", async () => {
        const data: UpdateCommentModel = {
            content: updatingText
        };

        await request(app)
            .put(`/api/comments/${firstComment.id}`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send(data)
            .expect(403);
    });

    // Checking
    it("GET: should return same first comment", async () => {
        const result = await request(app)
            .get(`/api/comments/${firstComment.id}`)
            .expect(200);

        expect(result.body).toEqual({...firstComment, content: "New content correct data str str str str"});
    });

    // --------- PUT: Testing forbidden delete ---------
    it("DELETE: should delete comment", async () => {
        await request(app)
            .delete(`/api/comments/${firstComment.id}`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .expect(403);
    });

    // Checking
    it("GET: should return same first comment", async () => {
        const result = await request(app)
            .get(`/api/comments/${firstComment.id}`)
            .expect(200);

        expect(result.body).toEqual(firstComment);
    });


    // --------- DELETE: Testing deleting of comments ---------
    // --------- Prepare data: User relogin ---------

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

    it("Get: get current (firstUser) user data", async () => {
        const result = await request(app)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${jwtToken}`)
            .expect(200);

        expect(result.body).toEqual({
            email: firstUser.email,
            login: firstUser.login,
            userId: expect.any(String)
        });

        firstUserId = result.body.userId;
    });

    // --------- ---------

    it("DELETE: shouldn`t delete comment with wrong id", async () => {
        await request(app)
            .delete(`/api/comments/111`) // Post not exists
            .set("Authorization", `Bearer ${jwtToken}`)
            .expect(404);
    });

    it("DELETE: shouldn`t delete comment without jwt token", async () => {
        await request(app)
            .delete(`/api/comments/${firstComment.id}`)
            .expect(401);
    });

    it("DELETE: should delete comment", async () => {
        await request(app)
            .delete(`/api/comments/${firstComment.id}`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .expect(204);
    });

    // Check that arr is empty
    it("GET: should return empty array of comments", async () => {
        const result = await request(app)
            .get(`/api/posts/${firstPost.id}/comments`)
            .expect(200);

        expect(result.body.items).toEqual([]);
    });
});