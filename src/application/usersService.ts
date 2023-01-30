import {UsersRepository} from "../repositories/users/usersRepository";
import {inject, injectable} from "inversify";
import {User} from "../domain/User/UserScheme";
import {HydratedUser} from "../domain/User/UserTypes";

@injectable()
export class UsersService {
    constructor(
        @inject(UsersRepository) protected usersRepository: UsersRepository
    ) {}

    async createUser(login: string, email: string, password: string, isConfirmed: boolean = false): Promise<HydratedUser> {
        const newUser: HydratedUser = await User.createInstance(login, email, password, isConfirmed);
        return newUser;
    }
    async deleteUser(id: string): Promise<boolean> {
        return await this.usersRepository.deleteUser(id);
    }
    async deleteAllUsers() {
        return this.usersRepository.deleteAllUsers();
    }
}