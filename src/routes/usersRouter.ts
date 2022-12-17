import express, {Response} from "express";
import {Paginator, RequestWithBody, RequestWithParams, RequestWithQuery} from "../types/types";
import {QueryUserModel} from "../types/userTypes";
import {ViewUserModel} from "../models/user/viewUserModel";
import {CreateUserModel} from "../models/user/createUserModel";
import {basicAuthMiddleware} from "../middlewares/auth/basicAuthMiddleware";
import {userRegistrationValidationSchema} from "../middlewares/validation/auth/userRegistration";
import {mapUserAccountTypeToViewUserModel} from "../helpers/mappers";
import {UriParamsUserModel} from "../models/user/uriParamsUserModel";
import {UserAccountType} from "../repositories/users/userSchema";
import {UsersQueryRepository} from "../repositories/users/queryUsersRepository";
import {UsersService} from "../domain/usersService";

export const usersRouter = express.Router();

class UsersController {
    private usersQueryRepository: UsersQueryRepository;
    private usersService: UsersService;

    constructor() {
        this.usersQueryRepository = new UsersQueryRepository();
        this.usersService = new UsersService();
    }

    async getUsers(req: RequestWithQuery<QueryUserModel>, res: Response<Paginator<ViewUserModel>>) {
        const users = await this.usersQueryRepository.findUsers(req.query);
        res.json(users);
    }

    async createUser(req: RequestWithBody<CreateUserModel>, res: Response<ViewUserModel>) {
        const createdUser: UserAccountType | null = await this.usersService.createUser(req.body.login, req.body.email, req.body.password, true); // Make confirmed users

        if (!createdUser) {
            res.sendStatus(400);
            return;
        }
        res.status(201)
            .json(mapUserAccountTypeToViewUserModel(createdUser));
    }

    async deleteUser(req: RequestWithParams<UriParamsUserModel>, res: Response) {
        const isDeleted: boolean = await this.usersService.deleteUser(req.params.id);

        if (isDeleted) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    }
}

const usersController = new UsersController();

usersRouter.get("/",
    usersController.getUsers.bind(usersController)
);

// Test creation of users
usersRouter.post("/",
    basicAuthMiddleware,
    userRegistrationValidationSchema,
    usersController.createUser.bind(usersController)
);

usersRouter.delete("/:id",
    basicAuthMiddleware,
    usersController.deleteUser.bind(usersController)
);