import express, {Request, Response, NextFunction} from 'express';
import cookieParser from 'cookie-parser';
import {SETTINGS} from "./config";
import {authRouter} from "./routes/authRouter";
import {usersRouter} from "./routes/usersRouter";
import {blogsRouter} from "./routes/blogsRouter";
import {postsRouter} from "./routes/postsRouter";
import {commentsRouter} from "./routes/commentsRouter";
import {mongooseConnectToDB} from "./repositories/db";
import {securityRouter} from "./routes/securityRouter";
import {deleteAllRouter} from "./routes/deleteAllRouter";
import {cookiesLogs} from "./helpers/testLogs";

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
    TOO_MANY_REQUESTS_429 = 429,

    INTERNAL_SERVER_ERROR_500 = 500
}

const port = process.env.PORT || 3000;
export const app = express();

app.set('trust proxy', true);

app.use(express.json());
app.use(cookieParser());


//--- Show cookies ------
cookiesLogs(SETTINGS.EXTENDED_LOGS);

app.use(URL_ROUTES.auth, authRouter);
app.use(URL_ROUTES.security, securityRouter);
app.use(URL_ROUTES.users, usersRouter);
app.use(URL_ROUTES.blogs, blogsRouter);
app.use(URL_ROUTES.posts, postsRouter);
app.use(URL_ROUTES.comments, commentsRouter);
app.use(URL_ROUTES.testing, deleteAllRouter);
//app.use(errorsHandlingMiddleware); // Error handling


const startApp = async () => {
    await mongooseConnectToDB();

    app.listen(port, () => {
        console.log(`Server is running on ${port}`);
    });
}

startApp().catch(error => {console.log(error)});

