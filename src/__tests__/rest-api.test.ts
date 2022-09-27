import request from 'supertest';
import {app} from "../index";
import {CreateBlogModel} from "../models/blog/create-blog-model";
import {BlogViewModel} from "../models/blog/blog-view-model";
import {APIErrorResult} from "../types/types";
import {PostViewModel} from "../models/post/post-view-model";
import {CreatePostModel} from "../models/post/create-post-model";
import {UpdateBlogModel} from "../models/blog/update-blog-model";
import {UpdatePostModel} from "../models/post/update-post-model";


// BLOGS
describe("blogs", () => {
    // GET
    // it("GET:blogs should return 3 posts", async () => {
    //     const result = await request(app)
    //         .get("/api/blogs");
    //
    //     expect(result.status).toBe(200);
    //     expect(result.body.length).toBe(3);
    // });
    //
    // it("GET:blogs should return post with id 1", async () => {
    //     const result = await request(app)
    //         .get("/api/blogs/1");
    //
    //     expect(result.status).toBe(200);
    //
    //     const expectedObj: BlogViewModel = {
    //         id: "1",
    //         name: "first-blog",
    //         youtubeUrl: "url-1",
    //         createdAt: expect.any(String)
    //     };
    //     expect(result.body).toEqual(expectedObj);
    // });

    // POST
    let firstBlog: any = null;
    it("POST:blogs should create post", async () => {
        const data: CreateBlogModel = {
            name: "New Blog",
            youtubeUrl: "https://www.youtube.com"
        };

        const result = await request(app)
            .post("/api/blogs")
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data);

        firstBlog = result.body;

        expect(result.status).toBe(201);
        const expectedObj: BlogViewModel = {
            id: expect.any(String),
            name: data.name,
            youtubeUrl: data.youtubeUrl,
            createdAt: expect.any(String)
        };
        expect(result.body).toEqual(    expectedObj);
    });

    it("GET:blogs should return created post", async () => {
        const result = await request(app)
            .get(`/api/blogs/${firstBlog?.id}`);

        expect(result.status).toBe(200);
        expect(result.body).toEqual(firstBlog);
    });

    let secondBlog: any = null;
    it("POST:blogs should create post with spaces", async () => {
        const data: CreateBlogModel = {
            name: "   Spaces       ",
            youtubeUrl: "https://www.youtube.com"
        };
        const result = await request(app)
            .post("/api/blogs")
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send( data);

        secondBlog = result.body;

        expect(result.status).toBe(201);
        const expecedObj: BlogViewModel = {
            id: expect.any(String),
            name: data.name.trim(),
            youtubeUrl: data.youtubeUrl,
            createdAt: expect.any(String)
        };
        expect(result.body).toEqual(expecedObj);
    });

    it("POST:blogs shouldn`t create post with lenth > 15", async () => {
        const data: CreateBlogModel = {
            name: "1234567890123456",
            youtubeUrl: "https://www.youtube.com"
        };

        const result = await request(app)
            .post("/api/blogs")
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data);

        expect(result.status).toBe(400);
        const expectedError: APIErrorResult = {
            errorsMessages: [
                {
                    "message": expect.any(String),
                    "field": "name"
                }
            ]
        };
        expect(result.body).toEqual(expectedError);
    });


    it("POST:blogs shouldn`t create post without youtubeUrl", async () => {
        const result = await request(app)
            .post("/api/blogs")
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send({
                name: "New post"
            });

        expect(result.status).toBe(400);
        const expectedError: APIErrorResult = {
            errorsMessages: [
                {
                    "message": expect.any(String),
                    "field": "youtubeUrl"
                }
            ]
        };
        expect(result.body).toEqual(expectedError);
    });

    it("POST:blogs shouldn`t create post with lentgth > 100", async () => {
        const data: CreateBlogModel = {
            name: "New post",
            youtubeUrl: "https://www.youtube.comLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean m1"
        };
        const result = await request(app)
            .post("/api/blogs")
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data);

        expect(result.status).toBe(400);
        const expectedError: APIErrorResult = {
            errorsMessages: [
                {
                    "message": expect.any(String),
                    "field": "youtubeUrl"
                }
            ]
        };
        expect(result.body).toEqual(expectedError);
    });

    it("POST:blogs shouldn`t create post with wrong url", async () => {
        const data: CreateBlogModel = {
            name: "New post",
            youtubeUrl: "https:\\/www.youtube.com"
        };
        const result = await request(app)
            .post("/api/blogs")
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data);

        expect(result.status).toBe(400);
        const expectedError = {
            errorsMessages: [
                {
                    "message": expect.any(String),
                    "field": "youtubeUrl"
                }
            ]
        };
        expect(result.body).toEqual(expectedError);
    });

    // PUT
    it("PUT:blogs should be updated by correct data", async () => {
        const data: CreateBlogModel = {
            name: "Changed title",
            youtubeUrl: "https://www.google.com"
        };
        await request(app)
            .put(`/api/blogs/${firstBlog.id}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data).expect(204);

        const result = await request(app)
            .get(`/api/blogs/${firstBlog?.id}`);

        expect(result.status).toBe(200);
        const expectedObj: BlogViewModel = {
            id: expect.any(String),
            name: data.name,
            youtubeUrl: data.youtubeUrl,
            createdAt: expect.any(String)
        };
        expect(result.body).toEqual(expectedObj);
    });

    it("PUT:blogs shouldn`t be updated by wrong data (without field 'name')", async () => {
        await request(app)
            .put(`/api/blogs/${secondBlog.id}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send({
                youtubeUrl: "https://www.google.com"
            }).expect(400);

        const result = await request(app)
            .get(`/api/blogs/${secondBlog?.id}`);

        expect(result.status).toBe(200);
        expect(result.body).toEqual(secondBlog);
    });

    it("PUT:blogs shouldn`t be updated by wrong data (without field 'youtubeUrl')", async () => {
        await request(app)
            .put(`/api/blogs/${secondBlog.id}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send({
                name: "Changed Title"
            }).expect(400);

        const result = await request(app)
            .get(`/api/blogs/${secondBlog?.id}`);

        expect(result.status).toBe(200);
        expect(result.body).toEqual(secondBlog);
    });

    it("PUT:blogs shouldn`t be updated by wrong data (without wrong id)", async () => {
        const data: CreateBlogModel = {
            name: "Changed Title",
            youtubeUrl: "https://www.google.com"
        };
        await request(app)
            .put(`/api/blogs/1234556789`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data).expect(404);
    });

    // DELETE
    it("DELETE:blogs shouldn`t be deleted (without wrong id)", async () => {
        await request(app)
            .delete(`/api/blogs/1234556789`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(404);
    });

    it("DELETE:blogs should be deleted", async () => {
        await request(app)
            .delete(`/api/blogs/${firstBlog.id}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(204);

        await request(app)
            .delete(`/api/blogs/${secondBlog.id}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(204);
    });

    // it("GET:blogs should be again returned 3 posts", async () => {
    //     const result = await request(app)
    //         .get("/api/blogs");
    //
    //     expect(result.status).toBe(200);
    //     expect(result.body.length).toBe(3);
    //     //console.log(result.body);
    // });
});


// POSTS
describe("posts", () => {
   // GET
    it("GET: should return empty array", async () => {
        await request(app)
            .get("/api/posts")
            .expect(200, []);
    });

    // POST
    let firstPost: any = null;
    it("POST: should create post with correct data", async () => {
        const data: CreatePostModel = {
            title: "Correct title",
            shortDescription: "descr",
            content: "content",
            blogId: "1"
        };

        const result = await request(app)
            .post("/api/posts")
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data);

        firstPost = result.body;
        //console.log(firstPost);

        const expectedObj: PostViewModel = {
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

    it("POST: shouldn`t create post without Authorization header", async () => {
        const data = {
            title: "Correct title",
            shortDescription: "descr",
            content: "content",
            blogId: "1"
        };

        await request(app)
            .post("/api/posts")
            .send(data)
            .expect(401);
    });

    it("POST: shouldn`t create post with incorrect data", async () => {
        const data = {
            shortDescription: "descr",
            content: "content",
            blogId: "1"
        };

        const result = await request(app)
            .post("/api/posts")
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data)
            .expect(400);
    });

    it("POST: shouldn`t create post with not existed blogId", async () => {
        const data = {
            title: "Correct title",
            shortDescription: "descr",
            content: "content",
            blogId: "1000"
        };

        const result = await request(app)
            .post("/api/posts")
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data)
            .expect(400);

        const expectedError = {
            errorsMessages: [
                {
                    "message": expect.any(String),
                    "field": "blogId"
                }
            ]
        };
    });

    // Checking that post is not created
    it("GET: should return 1 element. Checking that post is not created", async () => {
        const result = await request(app)
            .get("/api/posts")
            .expect(200);

        expect(result.body.length).toBe(1);
    });

    // PUT
    it("PUT: should update post with correct data", async () => {
        const data: UpdatePostModel = {
            title: "Changed title",
            shortDescription: "new descr",
            content: "content",
            blogId: "1"
        };

        await request(app)
            .put(`/api/posts/${firstPost.id}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data)
            .expect(204);


        // GET:Checking updated post
        const updatedPost = await request(app)
            .get(`/api/posts/${firstPost.id}`);

        const expectedObj: PostViewModel = {
            id: expect.any(String),
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId,
            blogName: expect.any(String),
            createdAt: expect.any(String)
        };
        expect(updatedPost.body).toEqual(expectedObj);
    });

    it("PUT: shouldn`t update post with incorrect data", async () => {
        const data: UpdatePostModel = {
            title: "Changed title123456789012345678901234567890",
            shortDescription: "new descr",
            content: "content",
            blogId: "1"
        };

        await request(app)
            .put(`/api/posts/${firstPost.id}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data)
            .expect(400);
    });

    it("PUT: shouldn`t update post with incorrect blogId", async () => {
        const data: UpdatePostModel = {
            title: "Changed title",
            shortDescription: "new descr",
            content: "content",
            blogId: "111"
        };

        await request(app)
            .put(`/api/posts/${firstPost.id}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data)
            .expect(400);
    });

    it("PUT: shouldn`t update not existing post (id)", async () => {
        const data: UpdatePostModel = {
            title: "Changed title",
            shortDescription: "new descr",
            content: "content",
            blogId: "1"
        };

        await request(app)
            .put(`/api/posts/1111`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data)
            .expect(404);
    });

    // DELETE
    it("DELETE: shouldn`t delete post with wrong id", async () => {
        await request(app)
            .delete(`/api/posts/1111`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(404);
    });

    it("DELETE: should return empty array", async () => {
        await request(app)
            .delete(`/api/posts/${firstPost.id}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(204);
    });

    // Check that arr is empty
    it("GET: should return empty array", async () => {
        await request(app)
            .get("/api/posts")
            .expect(200, []);
    });
});

describe("testing/delete", () => {
    // Create Post
    it("POST: should create post with correct data", async () => {
        const data: CreatePostModel = {
            title: "Correct title",
            shortDescription: "descr",
            content: "content",
            blogId: "1"
        };

        const result = await request(app)
            .post("/api/posts")
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data);

        const firstPost = result.body;

        const expectedObj: PostViewModel = {
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

    //Check that arrays is not empty
    it("GET:blogs should return not empty arr", async () => {
        const result = await request(app)
            .get("/api/blogs");

        console.log(result.body.length);
        expect(result.status).toBe(200);
        expect(result.body.length).toBeGreaterThan(0);
    });


    it("GET: should return empty array", async () => {
        const result = await request(app)
            .get("/api/posts");

        console.log(result.body.length);
        expect(result.status).toBe(200);
        expect(result.body.length).toBeGreaterThan(0);
    });


    // DELETE
    it("DELETE: should delete data from all array", async () => {
        await request(app)
            .delete("/api/testing/all-data")
            .expect(204);
    })

    //Check that arrays is empty
    it("GET:blogs should return not empty arr", async () => {
        const result = await request(app)
            .get("/api/blogs")
            .expect(200, []);
    });


    it("GET: should return empty array", async () => {
        const result = await request(app)
            .get("/api/posts")
            .expect(200, []);
    });
});