import {app} from "../../index";
import request from 'supertest';
import {CreateUserModel} from "../../models/user/createUserModel";
import {ViewUserModel} from "../../models/user/viewUserModel";
import {basicAuthValue, clearDB} from "./helpers/helpers";

//Testing: Users Route
describe("/users", () => {
    //Clear DB
    beforeAll(async () => {
        await clearDB();
    });

    let jwtToken: string = '';
    let bearerAuth = `Bearer ${jwtToken}`;

    // GET
    it("GET: should return empty array of Users", async () => {
        const response = await request(app)
            .get("/api/users")
            .expect(200);

        expect(response.body.items.length).toBe(0);
    });

    // Create User
    let firstUser: any = null;
    it("POST: should create user", async () => {
        const data: CreateUserModel = {
            email: "aaaaa1@gmail.com",
            login: "a1234567",
            password: "1234567"
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

    it("POST: shouldn`t create user without Authorization header", async () => {
        const data: CreateUserModel = {
            email: "aaaaa1@gmail.com",
            login: "a1234567",
            password: "1234567"
        };

        await request(app)
            .post("/api/users")
            .send(data)
            .expect(401);
    });

    it("POST: shouldn`t create user with incorrect data", async () => {
        const data: CreateUserModel = {
            email: "aaaaa1f///gmail.com",
            login: "1",
            password: "12"
        };

        const result = await request(app)
            .post("/api/users")
            .set("Authorization", basicAuthValue)
            .send(data)
            .expect(400);

        expect(result.body).toEqual(
            {
                errorsMessages: [
                    {
                        message: expect.any(String),
                        field: 'login'
                    },
                    {
                        message: expect.any(String),
                        field: 'password'
                    },
                    {
                        message: expect.any(String),
                        field: 'email'
                    }
                ]
            }
        );
    });

    // Checking that only one user created
    it("GET: should return one user", async () => {
        const result = await request(app)
            .get("/api/users")
            .expect(200);

        console.log(result.body.items);
        console.log(firstUser);

        expect(result.body.items.length).toBe(1);
        expect(result.body.items[0]).toEqual(firstUser);
    });

    // DELETE
    it("DELETE: shouldn`t delete user with wrong id", async () => {
        await request(app)
            .delete(`/api/users/1111`) // Post not exists
            .set("Authorization", basicAuthValue)
            .expect(404);
    });

    it("DELETE: should delete user successfully - 204", async () => {
        await request(app)
            .delete(`/api/users/${firstUser.id}`)
            .set("Authorization", basicAuthValue)
            .expect(204);
    });

    // Check that arr of users is empty
    it("GET: should return empty array", async () => {
        const result = await request(app)
            .get("/api/users")
            .expect(200);

        expect(result.body.items).toEqual([]);
    });
});