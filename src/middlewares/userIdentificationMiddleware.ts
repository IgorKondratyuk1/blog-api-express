import {NextFunction, Request, Response} from "express";
import {container} from "../compositionRoot";
import {jwtService} from "../02_application/jwtService";
import {HydratedUser} from "../01_domain/User/UserTypes";
import {UsersRepository} from "../repositories/users/usersRepository";

const usersRepository = container.resolve(UsersRepository);

export const userIdentification = async (req: Request, res: Response, next: NextFunction) => {
    const clientAuthHeader = req.header("authorization");
    const authType = clientAuthHeader?.split(" ")[0];
    const token = clientAuthHeader?.split(' ')[1];
    console.log("User Identification Middleware");
    console.log(clientAuthHeader);

    if (!clientAuthHeader || !token || authType?.toLowerCase() !== "bearer") {
        req.userId = "";
        next();
        return;
    }

    const userId = await jwtService.getUserIdByToken(token);
    console.log("userId: " + userId);

    if (!userId) {
        req.userId = "";
        next();
        return;
    }

    const foundedUser: HydratedUser | null = await usersRepository.findUserById(userId);
    console.log("foundedUser: " + foundedUser);
    if (!foundedUser) { req.userId = ""; return; }
    req.userId = foundedUser.id;
    
    next();
}