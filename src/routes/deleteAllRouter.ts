import {Request, Response, Router} from "express";
import {SETTINGS} from "../config";
import {container} from "../compositionRoot";
import {DeleteAllController} from "./controllers/deleteAllController";

const deleteAllController = container.resolve(DeleteAllController);

export const deleteAllRouter = Router();

deleteAllRouter.delete("/all-data", deleteAllController.delete.bind(deleteAllController));

// Test routes
deleteAllRouter.get('/cookie', async (req: Request, res: Response) => {
    //console.log('Cookies: ', req.cookies);
    console.log(new Date());
    res.clearCookie('name1');
    res.cookie('name1', 'express1', {
        httpOnly: true,
        secure: false,
        maxAge: 20 * 1000
    });
    res.cookie('name2', 'express2')
    res.sendStatus(200);
});

deleteAllRouter.get('/envs', async (req: Request, res: Response) => {
    res.json(SETTINGS);
});