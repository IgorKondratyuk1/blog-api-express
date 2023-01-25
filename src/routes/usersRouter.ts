import express from "express";
import {basicAuthMiddleware} from "../middlewares/auth/basicAuthMiddleware";
import {container} from "../compositionRoot";
import {UsersController} from "./controllers/usersController";
import {userRegistrationValidation} from "../middlewares/validation/auth/userRegistrationValidation";

const usersController = container.resolve(UsersController);

export const usersRouter = express.Router();

usersRouter.get("/",
    usersController.getUsers.bind(usersController)
);

// Test creation of users
usersRouter.post("/",
    basicAuthMiddleware,
    userRegistrationValidation,
    usersController.createUser.bind(usersController)
);

usersRouter.delete("/:id",
    basicAuthMiddleware,
    usersController.deleteUser.bind(usersController)
);