// @ts-ignore
import request from "supertest";
import {app} from "../../index";
import {CreateBlogModel} from "../../models/blog/createBlogModel";
import {basicAuthValue} from "./helpers/helpers";
import {ViewBlogModel} from "../../models/blog/viewBlogModel";
import {CreatePostModel} from "../../models/post/createPostModel";
import {ViewPostModel} from "../../models/post/viewPostModel";

// Testing: Delete all data
describe("/testing/delete", () => {
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

        const firstPost = result.body;

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

    //Check that arrays is not empty
    it("GET:blogs should return not empty arr", async () => {
        const result = await request(app)
            .get("/api/blogs");

        expect(result.status).toBe(200);
        expect(result.body.items.length).toBeGreaterThan(0);
    });


    it("GET: should return empty array", async () => {
        const result = await request(app)
            .get("/api/posts");

        expect(result.status).toBe(200);
        expect(result.body.items.length).toBeGreaterThan(0);
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