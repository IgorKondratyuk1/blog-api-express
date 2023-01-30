import {UsersQueryRepository} from "../../repositories/users/queryUsersRepository";
import {UsersService} from "../../application/usersService";
import {Paginator, RequestWithBody, RequestWithParams, RequestWithQuery} from "../../types/types";
import {QueryUserModel} from "../../types/userTypes";
import {Response} from "express";
import {ViewUserModel} from "../../models/user/viewUserModel";
import {CreateUserModel} from "../../models/user/createUserModel";
import {mapUserAccountTypeToViewUserModel} from "../../helpers/mappers";
import {UriParamsUserModel} from "../../models/user/uriParamsUserModel";
import {inject, injectable} from "inversify";
import {HydratedUser} from "../../domain/User/UserTypes";

@injectable()
export class UsersController {
    constructor(
        @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository,
        @inject(UsersService) protected usersService: UsersService
    ) {}

    async getUsers(req: RequestWithQuery<QueryUserModel>, res: Response<Paginator<ViewUserModel>>) {
        const users = await this.usersQueryRepository.findUsers(req.query);
        res.json(users);
    }

    async createUser(req: RequestWithBody<CreateUserModel>, res: Response<ViewUserModel>) {
        const createdUser: HydratedUser | null = await this.usersService.createUser(req.body.login, req.body.email, req.body.password, true); // Make confirmed users

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