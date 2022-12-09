import {SETTINGS} from "../config";
import {NextFunction, Request, Response} from "express";
import {app} from "../index";

export const cookiesLogs = (isLogging: boolean) => {
    if (isLogging) {
        console.log(`Is local version: ` + SETTINGS.IS_LOCAL_VERSION);

        app.use('/', (req: Request, res: Response, next: NextFunction) => {
            console.log('\n>>>\tCookies from main');
            //console.log(req.cookies);
            console.log(req.path); // +
            console.log(req.url);
            console.log('>>>\tEnd\n');
            next();
        });
    }
}