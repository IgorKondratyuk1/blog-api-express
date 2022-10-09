import {Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {RequestWithBody} from "../types/types";
import {LoginInputModel} from "../models/auth/login-input-model";

export const authRouter = Router({});

authRouter.post("/login", async (req: RequestWithBody<LoginInputModel>, res: Response) => {
    const haveCredentials = await usersService.checkCredentials(req.body.password, req.body.login);
    if (haveCredentials) {
        res.sendStatus(204);
    } else {
        res.sendStatus(401);
    }
});