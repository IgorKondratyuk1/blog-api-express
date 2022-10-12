import request from 'supertest';
import {app} from "../../index";
import {CreateBlogModel} from "../../models/blog/create-blog-model";
import {ViewBlogModel} from "../../models/blog/view-blog-model";
import {APIErrorResult, Paginator} from "../../types/types";
import {ViewPostModel} from "../../models/post/view-post-model";
import {CreatePostModel} from "../../models/post/create-post-model";
import {UpdateBlogModel} from "../../models/blog/update-blog-model";
import {UpdatePostModel} from "../../models/post/update-post-model";
import {CreatePostOfBlogModel} from "../../models/post/create-post-of-blog";
import {BlogType} from "../../types/blog-types";
import {PostType} from "../../types/post-types";

const clearDB = async () => {
    await request(app)
        .delete("/api/testing/all-data")
        .set("Authorization", "Basic YWRtaW46cXdlcnR5");

    console.log("Database is empty");
}

// Testing: Blogs Route
describe("/blogs", () => {
    //Clear DB
    beforeAll(async () => {
        await clearDB();
    });

    // POST
    let firstBlog: any = null;
    it("POST: should create blog", async () => {
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
        const expectedObj: ViewBlogModel = {
            id: expect.any(String),
            name: data.name,
            youtubeUrl: data.youtubeUrl,
            createdAt: expect.any(String)
        };
        expect(result.body).toEqual(expectedObj);
    });

    it("GET: should return created blog", async () => {
        const result = await request(app)
            .get(`/api/blogs/${firstBlog.id}`);

        expect(result.status).toBe(200);
        expect(result.body).toEqual(firstBlog);
    });

    let secondBlog: any = null;
    it("POST: should create blog with spaces", async () => {
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
        const expecedObj: ViewBlogModel = {
            id: expect.any(String),
            name: data.name.trim(),
            youtubeUrl: data.youtubeUrl,
            createdAt: expect.any(String)
        };
        expect(result.body).toEqual(expecedObj);
    });

    it("GET: should return created blogs", async () => {
        const result = await request(app)
            .get('/api/blogs')
            .expect(200);

        const expectedObj: Paginator<ViewBlogModel> = {
            page: 1,
            pageSize: 10,
            pagesCount: 1,
            totalCount: 2,
            items: expect.any(Array)
        }

        console.log(firstBlog);
        console.log(result.body.items[1]);

        expect(result.body).toEqual(expectedObj);
        expect(result.body.items.length).toBe(2);
        expect(result.body.items[1]).toEqual(firstBlog);
        expect(result.body.items[0]).toEqual(secondBlog);
    });

    it("POST: shouldn`t create blog with lenth > 15", async () => {
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


    it("POST: shouldn`t create blog without youtubeUrl", async () => {
        const result = await request(app)
            .post("/api/blogs")
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send({
                name: "New blog"
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

    it("POST: shouldn`t create blog with lentgth > 100", async () => {
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

    it("POST: shouldn`t create blog with wrong url", async () => {
        const data: CreateBlogModel = {
            name: "New blog",
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
    it("PUT: blog should be updated by correct data", async () => {
        const data: UpdateBlogModel = {
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
        const expectedObj: ViewBlogModel = {
            id: expect.any(String),
            name: data.name,
            youtubeUrl: data.youtubeUrl,
            createdAt: expect.any(String)
        };
        expect(result.body).toEqual(expectedObj);
    });

    it("PUT: blog shouldn`t be updated by wrong data (without field 'name')", async () => {
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

    it("PUT: blog shouldn`t be updated by wrong data (without field 'youtubeUrl')", async () => {
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

    it("PUT: blog shouldn`t be updated by wrong data (without wrong id)", async () => {
        const data: UpdateBlogModel = {
            name: "Changed Title",
            youtubeUrl: "https://www.google.com"
        };

        await request(app)
            .put(`/api/blogs/1234556789`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data).expect(404);
    });

    // DELETE
    it("DELETE: blog shouldn`t be deleted (without wrong id)", async () => {
        await request(app)
            .delete(`/api/blogs/1234556789`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(404);
    });

    it("DELETE: blog should be deleted", async () => {
        await request(app)
            .delete(`/api/blogs/${firstBlog.id}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(204);

        await request(app)
            .delete(`/api/blogs/${secondBlog.id}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(204);
    });

    it("GET: should be 0 blogs", async () => {
        const result = await request(app)
            .get("/api/blogs");

        expect(result.status).toBe(200);
        expect(result.body.items.length).toBe(0);
    });
});

// Testing: Posts of blog Route
describe("/blogs/:blogId/posts", () => {
    const BLOGS_QUANTITY = 5,
          POSTS_QUANTITY = 10;
    let arrOfBlogs: BlogType[] = [],
        arrOfPosts: PostType[] = [];

    //Clear DB
    beforeAll(async () => {
        await clearDB();
    });

    it("POST: should be created 3 blogs", async () => {
        for (let i = 0; i < BLOGS_QUANTITY; i++) {
            const data: CreateBlogModel = {
                name: `New Blog ${i}`,
                youtubeUrl: `https://www.youtube.com/channel-${1}`
            };

            const result = await request(app)
                .post("/api/blogs")
                .set("Authorization", "Basic YWRtaW46cXdlcnR5")
                .send(data);

            arrOfBlogs.push(result.body);

            expect(result.status).toBe(201);
            const expectedObj: ViewBlogModel = {
                id: expect.any(String),
                name: arrOfBlogs[i].name,
                youtubeUrl: arrOfBlogs[i].youtubeUrl,
                createdAt: expect.any(String)
            };
            expect(result.body).toEqual(expectedObj);
        }
    });

    it("POST: should be created 5 posts of blog", async () => {
        for (let i = 0; i < POSTS_QUANTITY; i++) {
            const data: CreatePostOfBlogModel = {
                title: `Correct title ${i}`,
                shortDescription: `descr of ${i}`,
                content: `content of ${i}`
            };

            const result = await request(app)
                .post(`/api/blogs/${arrOfBlogs[0].id}/posts`)
                .set("Authorization", "Basic YWRtaW46cXdlcnR5")
                .send(data);

            arrOfPosts.push(result.body);

            const expectedObj: ViewPostModel = {
                id: expect.any(String),
                title: arrOfPosts[i].title,
                shortDescription: arrOfPosts[i].shortDescription,
                content: arrOfPosts[i].content,
                blogId: arrOfPosts[i].blogId,
                blogName: expect.any(String),
                createdAt: expect.any(String)
            };
            expect(result.status).toBe(201);
            expect(arrOfPosts[i]).toEqual(expectedObj);
        }
    });

    it("POST: shouldn`t be created post of not existing blog", async () => {
        const data: CreatePostOfBlogModel = {
            title: `Correct title`,
            shortDescription: `descr`,
            content: `content`
        };

        await request(app)
            .post("/api/blogs/100/posts")
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data)
            .expect(404);
    });

    it("POST: shouldn`t be created post without auth", async () => {
        const data: CreatePostModel = {
            title: `Correct title`,
            shortDescription: `descr`,
            content: `content`,
            blogId: "100"
        };

        await request(app)
            .post("/api/posts")
            .send(data)
            .expect(401);
    });

    it("POST: shouldn`t be created post with wrong data (title.length > 30)", async () => {
        const data: CreatePostOfBlogModel = {
            title: 'ccccccccccccccccccccccccccccccc',
            shortDescription: `descr`,
            content: `content`
        };

        await request(app)
            .post(`/api/blogs/${arrOfBlogs[0].id}/posts`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data)
            .expect(400);
    });

    // GET Posts of Blog
    it("GET: should return created posts of blog with default pagination", async () => {
        const result = await request(app)
            .get(`/api/blogs/${arrOfBlogs[0].id}/posts`)
            .expect(200);

        const expectedObj: Paginator<ViewPostModel> = {
            page: 1,
            pageSize: 10,
            pagesCount: 1,
            totalCount: 10,
            items: expect.any(Array)
        }

        expect(result.body).toEqual(expectedObj);
        expect(result.body.items.length).toBe(10);
        expect(result.body.items[0]).toEqual(arrOfPosts[arrOfPosts.length-1]);
        expect(result.body.items[1]).toEqual(arrOfPosts[arrOfPosts.length-2]);
    });

    it("GET: should return correct posts of blog", async () => {
        const result = await request(app)
            .get(`/api/blogs/${arrOfBlogs[0].id}/posts?pageNumber=1&pageSize=3&sortBy=createdAt&sortDirection=desc`)
            .expect(200);

        const expectedObj: Paginator<ViewPostModel> = {
            page: 1,
            pageSize: 3,
            pagesCount: 4,
            totalCount: 10,
            items: expect.any(Array)
        }

        expect(result.body).toEqual(expectedObj);
        expect(result.body.items.length).toBe(3);
        expect(result.body.items[0]).toEqual(arrOfPosts[arrOfPosts.length-1]);
        expect(result.body.items[1]).toEqual(arrOfPosts[arrOfPosts.length-2]);
    });

    it("GET: should return created posts of blog", async () => {
        const result = await request(app)
            .get(`/api/blogs/${arrOfBlogs[0].id}/posts?pageNumber=4&pageSize=3&sortBy=createdAt&sortDirection=desc`)
            .expect(200);

        const expectedObj: Paginator<ViewPostModel> = {
            page: 4,
            pageSize: 3,
            pagesCount: 4,
            totalCount: 10,
            items: expect.any(Array)
        }

        expect(result.body).toEqual(expectedObj);
        expect(result.body.items.length).toBe(1);
        expect(result.body.items[0]).toEqual(arrOfPosts[0]);
    });


    // DELETE Created data
    it("DELETE: should delete data from all array", async () => {
        await request(app)
            .delete("/api/testing/all-data")
            .expect(204);
    })

    //Check that arrays is empty
    it("GET:blogs should return not empty arr", async () => {
        const result = await request(app)
            .get("/api/blogs")
            .expect(200);

        expect(result.body.items.length).toBe(0);
    });

    it("GET: should return empty array", async () => {
        const result = await request(app)
            .get("/api/posts")
            .expect(200);

        expect(result.body.items.length).toBe(0);
    });

});

// Testing: Posts Route
describe("/posts", () => {
    //Clear DB
    beforeAll(async () => {
        await clearDB();
    });


    // Create Blog
    let firstBlog: any = null;
    it("POST: should create blog", async () => {
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
        const expectedObj: ViewBlogModel = {
            id: expect.any(String),
            name: data.name,
            youtubeUrl: data.youtubeUrl,
            createdAt: expect.any(String)
        };
        expect(result.body).toEqual(expectedObj);
    });

   // GET
    it("GET: should return empty array", async () => {
        const response = await request(app)
            .get("/api/posts")
            .expect(200);

        expect(response.body.items.length).toBe(0);
    });

    // POST
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
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
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

    it("POST: shouldn`t create post without Authorization header", async () => {
        const data = {
            title: "Correct title",
            shortDescription: "descr",
            content: "content",
            blogId: firstBlog.id
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
            blogId: firstBlog.id
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

        console.log(result.body.items);
        console.log(firstPost);

        expect(result.body.items.length).toBe(1);
        expect(result.body.items[0]).toEqual(firstPost);
    });

    // PUT
    it("PUT: should update post with correct data", async () => {
        const data: UpdatePostModel = {
            title: "Changed title",
            shortDescription: "new descr",
            content: "content",
            blogId: firstBlog.id
        };

        await request(app)
            .put(`/api/posts/${firstPost.id}`)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data)
            .expect(204);


        // GET:Checking updated post
        const updatedPost = await request(app)
            .get(`/api/posts/${firstPost.id}`);

        const expectedObj: ViewPostModel = {
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
            blogId: firstBlog.id
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
            blogId: firstBlog.id
        };

        await request(app)
            .put(`/api/posts/1111`) // Post not exists
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(data)
            .expect(404);
    });

    // DELETE
    it("DELETE: shouldn`t delete post with wrong id", async () => {
        await request(app)
            .delete(`/api/posts/1111`) // Post not exists
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

// Testing: Delete all data
describe("/testing/delete", () => {
    // Create Blog
    let firstBlog: any = null;
    it("POST: should create blog", async () => {
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
        const expectedObj: ViewBlogModel = {
            id: expect.any(String),
            name: data.name,
            youtubeUrl: data.youtubeUrl,
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
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
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