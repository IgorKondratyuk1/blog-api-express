// @ts-ignore
import request from "supertest";
import {app} from "../../../index";

export const basicAuthValue = "Basic YWRtaW46cXdlcnR5";
export const usersPassword: string = "12345678";

export const clearDB = async () => {
    await request(app)
        .delete("/api/testing/all-data")
        .set("Authorization", basicAuthValue);

    console.log("Database is empty");
}

export const later = (delay: any) => new Promise(resolve => setTimeout(resolve, delay));