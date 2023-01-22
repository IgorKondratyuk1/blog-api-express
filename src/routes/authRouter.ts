import {Router} from "express";
import {userRegistrationValidationSchema} from "../middlewares/validation/auth/userRegistration";
import {registrationConfirmationValidationSchema} from "../middlewares/validation/auth/registrationConfirmationSchema";
import {userLoginValidationSchema} from "../middlewares/validation/auth/loginSchema";
import {registrationEmailResendingValidationSchema} from "../middlewares/validation/auth/registrationEmailResending";
import {checkRefreshTokenMiddleware} from "../middlewares/auth/checkRefreshTokenMiddleware";
import {jwtAuthMiddleware} from "../middlewares/auth/jwtAuthMiddlewsre";
import {requestsLimiterMiddleware} from "../middlewares/requestsLimiterMiddleware";
import {passwordRecoveryValidationSchema} from "../middlewares/validation/auth/passwordRecoverySchema";
import {newPasswordValidationSchema} from "../middlewares/validation/auth/newPasswordSchema";
import {container} from "../compositionRoot";
import {AuthController} from "./controllers/authController";

const authController = container.resolve(AuthController);

export const authRouter = Router({});

authRouter.post("/login",
    requestsLimiterMiddleware,
    userLoginValidationSchema,
    authController.login.bind(authController)
);

authRouter.post("/registration",
    requestsLimiterMiddleware,
    userRegistrationValidationSchema,
    authController.registration.bind(authController)
);

authRouter.post("/registration-confirmation",
    requestsLimiterMiddleware,
    registrationConfirmationValidationSchema,
    authController.registrationConfirmation.bind(authController)
);

authRouter.post("/registration-email-resending",
    requestsLimiterMiddleware,
    registrationEmailResendingValidationSchema,
    authController.registrationEmailResending.bind(authController)
);

authRouter.post("/refresh-token",
    checkRefreshTokenMiddleware,
    authController.refreshToken.bind(authController)
);

authRouter.post("/password-recovery",
    requestsLimiterMiddleware,
    passwordRecoveryValidationSchema,
    authController.passwordRecovery.bind(authController)
);

authRouter.post("/new-password",
    requestsLimiterMiddleware,
    newPasswordValidationSchema,
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
