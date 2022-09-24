"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const src_1 = require("../index");
describe("blogs", () => {
    // GET
    it("GET:blogs should return 3 posts", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, supertest_1.default)(src_1.app)
            .get("/api/blogs");
        expect(result.status).toBe(200);
        expect(result.body.length).toBe(3);
    }));
    it("GET:blogs should return post with id 1", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, supertest_1.default)(src_1.app)
            .get("/api/blogs/1");
        expect(result.status).toBe(200);
        const expectedObj = {
            id: "1",
            name: "first-blog",
            youtubeUrl: "url-1"
        };
        expect(result.body).toEqual(expectedObj);
    }));
    // POST
    let firstPost = null;
    it("POST:blogs should create post", () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            name: "New Blog",
            youtubeUrl: "https://www.youtube.com"
        };
        const result = yield (0, supertest_1.default)(src_1.app)
            .post("/api/blogs")
            .send(data);
        firstPost = result.body;
        expect(result.status).toBe(201);
        const expectedObj = {
            id: expect.any(String),
            name: data.name,
            youtubeUrl: data.youtubeUrl
        };
        expect(result.body).toEqual(expectedObj);
    }));
    it("GET:blogs should return created post", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, supertest_1.default)(src_1.app)
            .get(`/api/blogs/${firstPost === null || firstPost === void 0 ? void 0 : firstPost.id}`);
        expect(result.status).toBe(200);
        expect(result.body).toEqual(firstPost);
    }));
    let secondPost = null;
    it("POST:blogs should create post with spaces", () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            name: "   Spaces       ",
            youtubeUrl: "https://www.youtube.com"
        };
        const result = yield (0, supertest_1.default)(src_1.app)
            .post("/api/blogs")
            .send(data);
        secondPost = result.body;
        expect(result.status).toBe(201);
        const expecedObj = {
            id: expect.any(String),
            name: data.name.trim(),
            youtubeUrl: data.youtubeUrl
        };
        expect(result.body).toEqual(expecedObj);
    }));
    it("POST:blogs shouldn`t create post with lenth > 15", () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            name: "1234567890123456",
            youtubeUrl: "https://www.youtube.com"
        };
        const result = yield (0, supertest_1.default)(src_1.app)
            .post("/api/blogs")
            .send(data);
        expect(result.status).toBe(400);
        const expectedError = {
            errorsMessages: [
                {
                    "message": expect.any(String),
                    "field": "name"
                }
            ]
        };
        expect(result.body).toEqual(expectedError);
    }));
    it("POST:blogs shouldn`t create post without youtubeUrl", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, supertest_1.default)(src_1.app)
            .post("/api/blogs")
            .send({
            name: "New post"
        });
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
    }));
    it("POST:blogs shouldn`t create post with lentgth > 100", () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            name: "New post",
            youtubeUrl: "https://www.youtube.comLorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean m1"
        };
        const result = yield (0, supertest_1.default)(src_1.app)
            .post("/api/blogs")
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
    }));
    it("POST:blogs shouldn`t create post with wrong url", () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            name: "New post",
            youtubeUrl: "https:\\/www.youtube.com"
        };
        const result = yield (0, supertest_1.default)(src_1.app)
            .post("/api/blogs")
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
    }));
    // PUT
    it("PUT:blogs should be updated by correct data", () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            name: "Changed title",
            youtubeUrl: "https://www.google.com"
        };
        yield (0, supertest_1.default)(src_1.app)
            .put(`/api/blogs/${firstPost.id}`)
            .send(data).expect(204);
        const result = yield (0, supertest_1.default)(src_1.app)
            .get(`/api/blogs/${firstPost === null || firstPost === void 0 ? void 0 : firstPost.id}`);
        expect(result.status).toBe(200);
        const expectedObj = {
            id: expect.any(String),
            name: data.name,
            youtubeUrl: data.youtubeUrl
        };
        expect(result.body).toEqual(expectedObj);
    }));
    it("PUT:blogs shouldn`t be updated by wrong data (without field 'name')", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app)
            .put(`/api/blogs/${secondPost.id}`)
            .send({
            youtubeUrl: "https://www.google.com"
        }).expect(400);
        const result = yield (0, supertest_1.default)(src_1.app)
            .get(`/api/blogs/${secondPost === null || secondPost === void 0 ? void 0 : secondPost.id}`);
        expect(result.status).toBe(200);
        expect(result.body).toEqual(secondPost);
    }));
    it("PUT:blogs shouldn`t be updated by wrong data (without field 'youtubeUrl')", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app)
            .put(`/api/blogs/${secondPost.id}`)
            .send({
            name: "Changed Title"
        }).expect(400);
        const result = yield (0, supertest_1.default)(src_1.app)
            .get(`/api/blogs/${secondPost === null || secondPost === void 0 ? void 0 : secondPost.id}`);
        expect(result.status).toBe(200);
        expect(result.body).toEqual(secondPost);
    }));
    it("PUT:blogs shouldn`t be updated by wrong data (without wrong id)", () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            name: "Changed Title",
            youtubeUrl: "https://www.google.com"
        };
        yield (0, supertest_1.default)(src_1.app)
            .put(`/api/blogs/1234556789`)
            .send(data).expect(404);
    }));
    // DELETE
    it("DELETE:blogs shouldn`t be deleted (without wrong id)", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app)
            .delete(`/api/blogs/1234556789`)
            .expect(404);
    }));
    it("DELETE:blogs should be deleted", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app)
            .delete(`/api/blogs/${firstPost.id}`)
            .expect(204);
        yield (0, supertest_1.default)(src_1.app)
            .delete(`/api/blogs/${secondPost.id}`)
            .expect(204);
    }));
    it("GET:blogs should be again returned 3 posts", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, supertest_1.default)(src_1.app)
            .get("/api/blogs");
        expect(result.status).toBe(200);
        expect(result.body.length).toBe(3);
        //console.log(result.body);
    }));
});
