import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {RequestWithBody} from "../types/types";
import {LoginInputModel} from "../models/auth/login-input-model";
import {jwtService} from "../application/jwt-service";
import {UserType} from "../types/user-types";
import {jwtAuthMiddleware} from "../middlewares/jwt-auth-middlewsre";
import {getMeViewModel} from "../helpers/helpers";
import {HTTP_STATUSES} from "../index";

export const authRouter = Router({});

authRouter.post("/login", async (req: RequestWithBody<LoginInputModel>, res: Response) => {
    const user: UserType | null = await usersService.checkCredentials(req.body.password, req.body.login);
    if (user) {
        const token: string = await jwtService.createJWT(user);
        res.json({
            accessToken: token
        });
    } else {
        res.sendStatus(401);
    }
});

authRouter.get("/me",
    jwtAuthMiddleware,
    async (req: Request, res: Response) => {

    const user: UserType | null = await usersService.findUserById(req.user.id);

    if (!user) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }

    res.json(getMeViewModel(user));
});