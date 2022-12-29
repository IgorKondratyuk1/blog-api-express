import express from "express";
import {basicAuthMiddleware} from "../middlewares/auth/basicAuthMiddleware";
import {userRegistrationValidationSchema} from "../middlewares/validation/auth/userRegistration";
import {UsersController} from "./controllers/usersController";
import {usersController} from "../compositionRoot";

export const usersRouter = express.Router();

usersRouter.get("/",
    usersController.getUsers.bind(usersController)
);

// Test creation of users
usersRouter.post("/",
    basicAuthMiddleware,
    userRegistrationValidationSchema,
    usersController.createUser.bind(usersController)
);

usersRouter.delete("/:id",
    basicAuthMiddleware,
    usersController.deleteUser.bind(usersController)
);