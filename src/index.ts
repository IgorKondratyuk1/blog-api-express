import express from 'express';
import bodyParser from "body-parser";
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import {errorsHandlingMiddleware} from "./middlewares/errors-handling-middleware";
import {testingRouter} from "./routes/testing-router";
import {connectToDB} from "./repositories/db";
import {usersRouter} from "./routes/users-router";
import {commentsRouter} from "./routes/comments-router";
import {authRouter} from "./routes/auth-router";

enum URL_ROUTES {
    auth = "/api/auth",
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
    NOT_FOUND_404 = 404
}

const port = process.env.PORT || 3000;
export const app = express();

app.use(bodyParser.json());
app.use(URL_ROUTES.auth, authRouter);
app.use(URL_ROUTES.users, usersRouter);
app.use(URL_ROUTES.blogs, blogsRouter);
app.use(URL_ROUTES.posts, postsRouter);
app.use(URL_ROUTES.comments, commentsRouter);
app.use(URL_ROUTES.testing, testingRouter);
app.use(errorsHandlingMiddleware); // Error handling

const startApp = async () => {
    await connectToDB();

    app.listen(port, () => {
        console.log(`Server is running on ${port}`);
    });
}

startApp();