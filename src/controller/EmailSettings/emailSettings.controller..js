const { INTERNAL_SERVER_ERROR, USER_NOT_FOUND, NOTIFICATION_NOT_FOUND } = require("../../constants/error.constant");
const { userAuthorzization } = require("../../middleware/authorized.middleware");
const userModel = require("../../models/auth");
const emailNotificationModel = require("../../models/emailNotification/emailNotification.model");

const setEmailNotification = async (newUser, req, res) => {
    const { setNotification, frequency, email, day } = req.body;
    const userId = newUser._id;

    const authorizationResult = await userAuthorzization(userId, req.userRrole, res)

        if (!authorizationResult.status) {
            return res.status(authorizationResult.statusCode).json({
                status: false,
                message: authorizationResult.message
            });
        }

    const existingEmailNotification = await emailNotificationModel.findOne({ userId: userId });
    if (existingEmailNotification) {
        await existingEmailNotification.save();
    } else {
        await emailNotificationModel.create({
            userId: newUser._id,
            dashboardSettings: {
                setSystemNotification: setNotification,
                notificationEmail: email,
                frequency: frequency,
                day: day
            },
            spiltTestSettings: {
                setSystemNotification: setNotification,
                notificationEmail: email,
                frequency: frequency,
                day: day
            }
        });
    }
};

const getEmailNotification = async (req, res) => {
    try {
        const userId = req.params.userId;
        const findUser = await userModel.findOne({ _id: userId })

        const authorizationResult = await userAuthorzization(userId, req.userRrole, res)

        if (!authorizationResult.status) {
            return res.status(authorizationResult.statusCode).json({
                status: false,
                message: authorizationResult.message
            });
        }

        if (findUser) {
            const notificationDetails = await emailNotificationModel.findOne({ userId: userId });
            if (notificationDetails) {
                res.status(200).json({
                    status: true,
                    message: "Email Notification details retrieved",
                    data: notificationDetails
                });
            } else {
                return res.status(404).json(NOTIFICATION_NOT_FOUND)
            }
        } else {
            return res.status(404).json(USER_NOT_FOUND)
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json(INTERNAL_SERVER_ERROR)
    }
};

const updateEmailNotification = async (req, res) => {
    try {
        const userId = req.params.userId;
        const findUser = await userModel.findOne({ _id: userId })

        const authorizationResult = await userAuthorzization(userId, req.userRrole, res)

        if (!authorizationResult.status) {
            return res.status(authorizationResult.statusCode).json({
                status: false,
                message: authorizationResult.message
            });
        }

        if (findUser) {
            const setNewNotificationDetails = await emailNotificationModel.findOneAndUpdate({ userId: userId }, { $set: req.body }, { new: true })
            res.status(200).json({
                status: true,
                message: "Email Notification details updated",
                data: setNewNotificationDetails
            });
        } else {
            return res.status(404).json(USER_NOT_FOUND)
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json(INTERNAL_SERVER_ERROR)
    }
};

module.exports = {
    setEmailNotification,
    getEmailNotification,
    updateEmailNotification
};