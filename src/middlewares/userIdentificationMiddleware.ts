import {NextFunction, Request, Response} from "express";
import {usersService} from "../compositionRoot";
import {jwtService} from "../application/jwtService";
import {UserAccountType} from "../repositories/users/userSchema";

const unknownUser = {
    id: null
}

export const userIdentification = async (req: Request, res: Response, next: NextFunction) => {
    const clientAuthHeader = req.header("authorization");
    const authType = clientAuthHeader?.split(" ")[0];
    const token = clientAuthHeader?.split(' ')[1];
    console.log("User Identification Middleware");
    console.log(clientAuthHeader);

    if (!clientAuthHeader || !token || authType?.toLowerCase() !== "bearer") {
        req.user = unknownUser;
        next();
        return;
    }

    const userId = await jwtService.getUserIdByToken(token);
    console.log("userId: " + userId);

    if (userId) {
        const foundedUser: UserAccountType | null = await usersService.findUserById(userId);
        console.log("foundedUser: " + foundedUser);

        if (!foundedUser) { req.user = unknownUser; return; }

        req.user = foundedUser;
    } else {
        req.user = unknownUser;
    }
    
    next();
}