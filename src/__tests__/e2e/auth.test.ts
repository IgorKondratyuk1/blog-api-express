// @ts-nocheck
import request from 'supertest';
import {app} from "../../index";
import {CreateUserModel} from "../../models/user/create-user-model";
import {ViewUserModel} from "../../models/user/view-user-model";
import {LoginInputModel} from "../../models/auth/login/login-input-model";

const basicAuthValue = "Basic YWRtaW46cXdlcnR5";
const usersPassword: string = "12345678";

// Helper functions
const later = (delay: any) => new Promise(resolve => setTimeout(resolve, delay));
const clearDB = async () => {
    await request(app)
        .delete("/api/testing/all-data")
        .set("Authorization", basicAuthValue);

    console.log("Database is empty");
}

jest.setTimeout(21000); //Tests timeout 30s

// Testing: Login
describe("/login", () => {
    //Clear DB
    beforeAll(async () => {
        await clearDB();
    });

    let accessToken: string = '';
    let refreshToken: string = '';

    // Create Test User
    let firstUser: any = null;
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

    //Login
    it("POST: user should login", async () => {
       const data: LoginInputModel = {
           login: firstUser.login,
           password: usersPassword
       }

        const result = await request(app)
            .post("/api/auth/login")
            .send(data)
            .expect(200);

        expect(result.body).toEqual({accessToken: expect.any(String)});
        accessToken = result.body.accessToken;

        const cookies = result.headers['set-cookie'][0].split(',').map((item: any) => item.split(';')[0]);
        refreshToken = cookies[0];
    });

    it("GET: user should get his info", async () => {
        const result = await request(app)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${accessToken}`)
            .expect(200);

        expect(result.body).toEqual({
            "email": firstUser.email,
            "login": firstUser.login,
            "userId": expect.any(String)
        });
    });

    it("GET: user shouldn`t get his info after 20 seconds (when access token is expire)", async () => {
       await later(10100);

        await request(app)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${accessToken}`)
            .expect(401);
    });

    // Login
    it("POST: user should login", async () => {
        const data: LoginInputModel = {
            login: firstUser.login,
            password: usersPassword
        }

        const result = await request(app)
            .post("/api/auth/login")
            .send(data)
            .expect(200);

        expect(result.body).toEqual({accessToken: expect.any(String)});
        accessToken = result.body.accessToken;

        const cookies = result.headers['set-cookie'][0].split(',').map((item: any) => item.split(';')[0]);
        refreshToken = cookies[0];
    });

    it("POST: user should get new refresh and access tokens", async () => {
        const result = await request(app)
            .post("/api/auth/refresh-token")
            .set('Cookie', [refreshToken])
            .expect(200);

        expect(result.body).toEqual({accessToken: expect.any(String)});
        accessToken = result.body.accessToken;
    });

    it("GET: user should get his info with new access token", async () => {
        const result = await request(app)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${accessToken}`)
            .expect(200);

        expect(result.body).toEqual({
            "email": firstUser.email,
            "login": firstUser.login,
            "userId": expect.any(String)
        });
    });


    it("POST: user shouldn`t get new refresh and access tokens with expired refresh token", async () => {
        await later(20100);

         await request(app)
            .post("/api/auth/refresh-token")
            .set('Cookie', [refreshToken])
            .expect(401);
    });

    it("POST: user should get 401 when logout with expired refresh token", async () => {
        await request(app)
            .post("/api/auth/logout")
            .set('Cookie', [refreshToken])
            .expect(401);
    });

    //Login
    it("POST: user should login", async () => {
        const data: LoginInputModel = {
            login: firstUser.login,
            password: usersPassword
        }

        const result = await request(app)
            .post("/api/auth/login")
            .send(data)
            .expect(200);

        expect(result.body).toEqual({accessToken: expect.any(String)});
        accessToken = result.body.accessToken;

        const cookies = result.headers['set-cookie'][0].split(',').map((item: any) => item.split(';')[0]);
        refreshToken = cookies[0];
    });

    it("POST: user should get 204 when logout", async () => {
        await request(app)
            .post("/api/auth/logout")
            .set('Cookie', [refreshToken])
            .expect(204);
    });

    it("POST: user shouldn`t get new refresh token when made logout", async () => {
        await request(app)
            .post("/api/auth/refresh-token")
            .set('Cookie', [refreshToken])
            .expect(401);
    });
});