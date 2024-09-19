const { Router } = require("express");
const {
    loginUser,
    createUser,
    userProfileSet,
    forgotPassword,
    resetPassword,
    verifyToken, 
    verifyUser, 
    verifyAccessTimeLimit,
    verifyUserAccessTimeLimit,
    verifyApi
} = require("../../controller/userController/user.controller");
const { CONSTANT_ROUTES } = require("../../constants/route.constants");

const userRouter = Router();

userRouter.post(CONSTANT_ROUTES.USER.LOGIN, loginUser);
userRouter.post(CONSTANT_ROUTES.USER.SIGNUP, createUser);

userRouter.get(CONSTANT_ROUTES.USER.PROFILE.USER_PROFILE, userProfileSet);

userRouter.post(CONSTANT_ROUTES.USER.FORGOT_PASSWORD, forgotPassword);
userRouter.put(CONSTANT_ROUTES.USER.RESET_PASSWORD, resetPassword);

userRouter.post(CONSTANT_ROUTES.USER.TOKEN.VERIFY_TOKEN, verifyToken);

// verify user
userRouter.put(CONSTANT_ROUTES.USER.VERIFY_USER.PUT, verifyUser)

userRouter.get(CONSTANT_ROUTES.USER.VERIFY_KEY.FORGOT_KEY, verifyAccessTimeLimit)

userRouter.get(CONSTANT_ROUTES.USER.VERIFY_KEY.SIGNUP_KEY, verifyUserAccessTimeLimit)

userRouter.post(CONSTANT_ROUTES.USER.VERIFY_API, verifyApi)

module.exports = userRouter;