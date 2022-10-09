import express, {Response} from "express";
import {Paginator, RequestWithBody, RequestWithParams, RequestWithQuery} from "../types/types";
import {QueryUserModel, UserDBType} from "../types/user-types";
import {ViewUserModel} from "../models/users/view-user-model";
import {usersQueryRepository} from "../repositories/users/query-users-repository";
import {usersService} from "../domain/users-service";
import {CreateUserModel} from "../models/users/create-user-model";
import {UriParamsUserModel} from "../models/users/uri-params-user-model";
import {authenticationMiddleware} from "../middlewares/authentication-middleware";
import {userRegistrationValidationSchema} from "../schemas/user-registration";

export const usersRouter = express.Router();

usersRouter.get("/", async (req: RequestWithQuery<QueryUserModel>, res: Response<Paginator<ViewUserModel>>) => {
    const users = await usersQueryRepository.findUsers(req.query);
    res.json(users);
});

usersRouter.post("/",
    authenticationMiddleware,
    userRegistrationValidationSchema,
    async (req: RequestWithBody<CreateUserModel>, res: Response<ViewUserModel>) => {
    const createdUser: ViewUserModel = await usersService.createUser(req.body.login, req.body.password, req.body.email);

    if (!createdUser) {
        res.sendStatus(400);
        return;
    }
    res.status(201)
        .json(createdUser);
});

usersRouter.delete("/:id",
    authenticationMiddleware,
    async (req: RequestWithParams<UriParamsUserModel>, res: Response) => {
    const isDeleted: boolean = await usersService.deleteUser(req.params.id);

    if (isDeleted) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});