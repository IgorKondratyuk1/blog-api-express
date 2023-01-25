import {Router} from "express";
import {checkRefreshTokenMiddleware} from "../middlewares/auth/checkRefreshTokenMiddleware";
import {jwtAuthMiddleware} from "../middlewares/auth/jwtAuthMiddlewsre";
import {requestsLimiterMiddleware} from "../middlewares/requestsLimiterMiddleware";
import {container} from "../compositionRoot";
import {AuthController} from "./controllers/authController";
import {registrationConfirmationValidation} from "../middlewares/validation/auth/registrationConfirmationValidation";
import {registrationEmailResendingValidation} from "../middlewares/validation/auth/registrationEmailResendingValidation";
import {passwordRecoveryValidation} from "../middlewares/validation/auth/passwordRecoveryValidation";
import {newPasswordValidation} from "../middlewares/validation/auth/newPasswordValidation";
import {userRegistrationValidation} from "../middlewares/validation/auth/userRegistrationValidation";
import {userLoginValidation} from "../middlewares/validation/auth/loginValidation";

const authController = container.resolve(AuthController);

export const authRouter = Router({});

authRouter.post("/login",
    requestsLimiterMiddleware,
    userLoginValidation,
    authController.login.bind(authController)
);

authRouter.post("/registration",
    requestsLimiterMiddleware,
    userRegistrationValidation,
    authController.registration.bind(authController)
);

authRouter.post("/registration-confirmation",
    requestsLimiterMiddleware,
    registrationConfirmationValidation,
    authController.registrationConfirmation.bind(authController)
);

authRouter.post("/registration-email-resending",
    requestsLimiterMiddleware,
    registrationEmailResendingValidation,
    authController.registrationEmailResending.bind(authController)
);

authRouter.post("/refresh-token",
    checkRefreshTokenMiddleware,
    authController.refreshToken.bind(authController)
);

authRouter.post("/password-recovery",
    requestsLimiterMiddleware,
    passwordRecoveryValidation,
    authController.passwordRecovery.bind(authController)
);

authRouter.post("/new-password",
    requestsLimiterMiddleware,
    newPasswordValidation,
    authController.newPassword.bind(authController)
);

authRouter.post("/logout",
    checkRefreshTokenMiddleware,
    authController.logout.bind(authController)
);

authRouter.get("/me",
    jwtAuthMiddleware,
    authController.me.bind(authController)
);
