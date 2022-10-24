import express, {Response} from "express";
import {Paginator, RequestWithBody, RequestWithParams, RequestWithQuery} from "../types/types";
import {QueryUserModel, UserAccountType, UserDBType} from "../types/user-types";
import {ViewUserModel} from "../models/user/view-user-model";
import {usersQueryRepository} from "../repositories/users/query-users-repository";
import {usersService} from "../domain/users-service";
import {CreateUserModel} from "../models/user/create-user-model";
import {UriParamsUserModel} from "../models/user/uri-params-user-model";
import {userRegistrationValidationSchema} from "../schemas/auth/user-registration";
import {basicAuthMiddleware} from "../middlewares/basic-auth-middleware";
import {mapUserAccountTypeToViewUserModel} from "../helpers/helpers";

export const usersRouter = express.Router();

usersRouter.get("/", async (req: RequestWithQuery<QueryUserModel>, res: Response<Paginator<ViewUserModel>>) => {
    const users = await usersQueryRepository.findUsers(req.query);
    res.json(users);
});

// Test creation of users
usersRouter.post("/",
    basicAuthMiddleware,
    userRegistrationValidationSchema,
    async (req: RequestWithBody<CreateUserModel>, res: Response<ViewUserModel>) => {
    const createdUser: UserAccountType | null = await usersService.createUser(req.body.login, req.body.email, req.body.password, true); // Make confirmed users

    if (!createdUser) {
        res.sendStatus(400);
        return;
    }
    res.status(201)
        .json(mapUserAccountTypeToViewUserModel(createdUser));
});

usersRouter.delete("/:id",
    basicAuthMiddleware,
    async (req: RequestWithParams<UriParamsUserModel>, res: Response) => {
    const isDeleted: boolean = await usersService.deleteUser(req.params.id);

    if (isDeleted) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});