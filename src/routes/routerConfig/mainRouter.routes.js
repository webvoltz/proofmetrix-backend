const express = require('express');
const userSetEmailNotificationRouter = require('../emailSettings/emailSettings.routes');
const userRouter = require('../user/user.routes');
const chatGPTRouter = require('../chatGPT/chatGPT.routes');

const mainRouter = express.Router();

mainRouter.use('/', userManagementRouter)

// user
mainRouter.use("/", userRouter);
mainRouter.use("/", userSetEmailNotificationRouter);
mainRouter.use("/", chatGPTRouter)

module.exports = mainRouter;
