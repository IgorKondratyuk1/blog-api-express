import request from 'supertest';
import {app} from "../../index";
import {basicAuthValue, clearDB, later, usersPassword} from "./helpers/helpers";
import {CreateUserModel} from "../../models/user/createUserModel";
import {LoginInputModel} from "../../models/auth/login/loginInputModel";
import {ViewUserModel} from "../../models/user/viewUserModel";

jest.setTimeout(21000); //Tests timeout 21s

// Testing: Login
describe("/login", () => {
    let accessToken: string = '';
    let refreshToken: string = '';

    let firstUser: any = null;
    let secondUser: any = null;

    //Clear DB
    beforeAll(async () => {
        await clearDB();
    });

    // Create first test User
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

    // Create second test User
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

    //Second User Login
    it("POST: second user should login", async () => {
        const data: LoginInputModel = {
            loginOrEmail: secondUser.login,
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

    it("GET: second user should get his info", async () => {
        const result = await request(app)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${accessToken}`)
            .expect(200);

        expect(result.body).toEqual({
            "email": secondUser.email,
            "login": secondUser.login,
            "userId": expect.any(String)
        });
    });

    //First User Login
    it("POST: first user should login", async () => {
       const data: LoginInputModel = {
           loginOrEmail: firstUser.login,
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

    // it("GET: user shouldn`t get his info after 20 seconds (when access token is expire)", async () => {
    //    await later(20100);
    //
    //     await request(app)
    //         .get("/api/auth/me")
    //         .set("Authorization", `Bearer ${accessToken}`)
    //         .expect(401);
    // });

    // Login
    it("POST: user should login", async () => {
        const data: LoginInputModel = {
            loginOrEmail: firstUser.login,
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

        // Save new access and refresh tokens
        accessToken = result.body.accessToken;

        const cookies = result.headers['set-cookie'][0].split(',').map((item: any) => item.split(';')[0]);
        refreshToken = cookies[0];
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

    // Expired token
    // it("POST: user shouldn`t get new refresh and access tokens with expired refresh token", async () => {
    //     await later(20100);
    //
    //      await request(app)
    //         .post("/api/auth/refresh-token")
    //         .set('Cookie', [refreshToken])
    //         .expect(401);
    // });

    // it("POST: user should get 401 when logout with expired refresh token", async () => {
    //     await request(app)
    //         .post("/api/auth/logout")
    //         .set('Cookie', [refreshToken])
    //         .expect(401);
    // });

    // Check logout
    it("POST: user should login", async () => {
        const data: LoginInputModel = {
            loginOrEmail: firstUser.login,
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

    // Check 429 "Too many requests"
    it("POST: should success login 5 times", async () => {
        await later(11000);

        const data: LoginInputModel = {
            loginOrEmail: firstUser.login,
            password: usersPassword
        }

        for (let i = 0; i < 5; i++) {
            const result = await request(app)
                .post("/api/auth/login")
                .send(data)
                .expect(200);

            console.log(`Request ${i} result:`);
            console.log(result.status);
            console.log(result.body);
            expect(result.body).toEqual({accessToken: expect.any(String)});
        }
    });

    it("POST: should get 429 status on 6-th request", async () => {
        const data: LoginInputModel = {
            loginOrEmail: firstUser.login,
            password: usersPassword
        }

        await request(app)
            .post("/api/auth/login")
            .send(data)
            .expect(429);
    });
});