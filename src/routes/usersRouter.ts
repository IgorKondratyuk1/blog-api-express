import express, {Response} from "express";
import {Paginator, RequestWithBody, RequestWithParams, RequestWithQuery} from "../types/types";
import {usersQueryRepository} from "../repositories/users/queryUsersRepository";
import {QueryUserModel} from "../types/userTypes";
import {ViewUserModel} from "../models/user/viewUserModel";
import {usersService} from "../domain/usersService";
import {CreateUserModel} from "../models/user/createUserModel";
import {basicAuthMiddleware} from "../middlewares/auth/basicAuthMiddleware";
import {userRegistrationValidationSchema} from "../middlewares/validation/auth/userRegistration";
import {mapUserAccountTypeToViewUserModel} from "../helpers/mappers";
import {UriParamsUserModel} from "../models/user/uriParamsUserModel";
import {UserAccountType} from "../repositories/users/userSchema";

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