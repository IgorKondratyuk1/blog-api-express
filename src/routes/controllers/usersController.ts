import {UsersQueryRepository} from "../../repositories/users/queryUsersRepository";
import {UsersService} from "../../domain/usersService";
import {Paginator, RequestWithBody, RequestWithParams, RequestWithQuery} from "../../types/types";
import {QueryUserModel} from "../../types/userTypes";
import {Response} from "express";
import {ViewUserModel} from "../../models/user/viewUserModel";
import {CreateUserModel} from "../../models/user/createUserModel";
import {UserAccountType} from "../../repositories/users/userSchema";
import {mapUserAccountTypeToViewUserModel} from "../../helpers/mappers";
import {UriParamsUserModel} from "../../models/user/uriParamsUserModel";

export class UsersController {
    constructor(
        protected usersQueryRepository: UsersQueryRepository,
        protected usersService: UsersService
    ) {
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