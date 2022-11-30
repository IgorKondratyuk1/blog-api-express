import express, {Request, Response, NextFunction} from 'express';
import cookieParser from 'cookie-parser';
import {SETTINGS} from "./config";
import {authRouter} from "./routes/authRouter";
import {usersRouter} from "./routes/usersRouter";
import {blogsRouter} from "./routes/blogsRouter";
import {postsRouter} from "./routes/postsRouter";
import {commentsRouter} from "./routes/commentsRouter";
import {testingRouter} from "./routes/testingRouter";
import {connectToDB} from "./repositories/db";
import {securityRouter} from "./routes/securityRouter";

enum URL_ROUTES {
    auth = "/api/auth",
    security = "/api/security/devices",
    users = "/api/users",
    blogs = "/api/blogs",
    posts = "/api/posts",
    comments = "/api/comments",
    testing = "/api/testing"
}

export enum HTTP_STATUSES {
    OK_200 = 200,
    CREATED_201 = 201,
    NO_CONTENT_204 = 204,

    BAD_REQUEST_400 = 400,
    UNAUTHORIZED_401 = 401,
    FORBIDDEN_403 = 403,
    NOT_FOUND_404 = 404,
    TOO_MANY_REQUESTS_429 = 429
}

const port = process.env.PORT || 3000;
export const app = express();

app.set('trust proxy', true);

app.use(express.json());
app.use(cookieParser());


//--- Show cookies ------
if (SETTINGS.EXTENDED_LOGS) {
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

app.use(URL_ROUTES.auth, authRouter);
app.use(URL_ROUTES.security, securityRouter);
app.use(URL_ROUTES.users, usersRouter);
app.use(URL_ROUTES.blogs, blogsRouter);
app.use(URL_ROUTES.posts, postsRouter);
app.use(URL_ROUTES.comments, commentsRouter);
app.use(URL_ROUTES.testing, testingRouter);
//app.use(errorsHandlingMiddleware); // Error handling


const startApp = async () => {
    await connectToDB();

    app.listen(port, () => {
        console.log(`Server is running on ${port}`);
    });
}

startApp().catch(error => {console.log(error)});

//globalCatch();