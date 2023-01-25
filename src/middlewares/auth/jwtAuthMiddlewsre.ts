import {NextFunction, Request, Response} from "express";
import {HTTP_STATUSES} from "../../index";
import {jwtService} from "../../02_application/jwtService";
import {container} from "../../compositionRoot";
import {UsersRepository} from "../../repositories/users/usersRepository";
import {HydratedUser} from "../../01_domain/User/UserTypes";

const usersRepository = container.resolve(UsersRepository);

export const jwtAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const clientAuthHeader = req.header("authorization");
    const authType = clientAuthHeader?.split(" ")[0];
    const token = clientAuthHeader?.split(' ')[1];

    if (!clientAuthHeader || !token || authType?.toLowerCase() !== "bearer") {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }

    const userId = await jwtService.getUserIdByToken(token);

    if (userId) {
        const foundedUser: HydratedUser | null = await usersRepository.findUserById(userId);
        if (!foundedUser) { res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401); return; }

        req.userId = foundedUser.id;
        req.userLogin = foundedUser.accountData.login;
        next();
    } else {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    }
}