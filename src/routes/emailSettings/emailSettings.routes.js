const { Router } = require("express");
const { CONSTANT_ROUTES } = require("../../constants/route.constants");
const {userOnly} = require("../../middleware/user.middleware");
const { updateEmailNotification, getEmailNotification } = require("../../controller/EmailSettings/emailSettings.controller.");

const userSetEmailNotificationRouter = Router();

userSetEmailNotificationRouter.get(CONSTANT_ROUTES.SET_EMAIL_NOTIFICATION.GET, userOnly, getEmailNotification);

userSetEmailNotificationRouter.put(CONSTANT_ROUTES.SET_EMAIL_NOTIFICATION.UPDATE, userOnly, updateEmailNotification);

module.exports = userSetEmailNotificationRouter;