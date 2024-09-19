const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateLoginInputs } = require("../../utils/validation");
const { generateToken } = require("../../utils/generateToken");
const { setEmailNotification } = require("../EmailSettings/emailSettings.controller.");
const userModel = require("../../models/auth");
const {
  INTERNAL_SERVER_ERROR,
  EMAIL_ALREADY_USE,
  USER_NOT_FOUND,
  INVALID_TOKEN,
  ER_KEY_EXPIRED,
  UNABLE_CHANGE_PASSWORD,
} = require("../../constants/error.constant");
require("dotenv").config();
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const { userAuthorzization } = require("../../middleware/authorized.middleware");

// handle user profile's
const userProfileSet = async (req, res) => {
  try {
    const { id } = req.params;
    const userProfile = await userModel.findOne({ _id: id });
    if (!userProfile) {
      return res
        .status(400)
        .json({ status: false, message: "User does not exists" });
    }
    res.status(200).json({ status: true, user: userProfile });
  } catch (error) {
    console.error(error);
    return res.status(500).json(INTERNAL_SERVER_ERROR);
  }
};

//handle create user
const createUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingEmail = await userModel.findOne({ email: email });
    if (existingEmail) {
      return res.status(403).json(EMAIL_ALREADY_USE);
    }
    const dataSolt = 10;
    const hashedPassword = await bcrypt.hash(password, dataSolt);

    const newUser = await userModel.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      is_verified: true,
      username: existingEmail.username
    });

    const userData = {
      ...newUser.dataValues,
      message: "Signed up successfully",
      data: newUser,
      userByAdmin: existingEmail
    };
    const messageData = {
      from: "Test Support <support@mail.Test.com>",
      to: email,
      subject: "Welcome to Test. Account Registration Complete.",
      template: "welcome to Test",
      'v:redirect_to_application': process.env.CLIENT_URL
    };

    const API_KEY = process.env.MAILGUN_API_KEY;
    const DOMAIN = process.env.MAILGUN_DOMAIN;

    const mailgun = new Mailgun(formData);
    const client = mailgun.client({ key: API_KEY, username: "api" });

    client?.messages
      .create(DOMAIN, messageData)
      .then((sendResponse) => {
        console.log("sendResponse", sendResponse);
      })
      .catch((sendError) => {
        console.error("sendError", sendError);
      });

    return res.status(200).json({
      status: true,
      message: "Account registration successful!",
      user: userData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(INTERNAL_SERVER_ERROR);
  }
};

const generateString = (length, characters) => {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(
      Math.floor(Math.random() * charactersLength)
    );
  }

  const randomString = result + characters;
  return randomString;
};

const verifyApi = async (req, res) => {
  try {
    const findUser = await userModel.findOne({
      email: req.body.email,
      is_verified: false
    });

    const characters = findUser._id.toString();

    // Await the result from generateString
    const randomKey = generateString(5, characters);

    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    findUser.timeLimitVerify = now;

    findUser.metaKeyVerify = randomKey;
    await findUser.save();

    const verifyURL = `${process.env.CLIENT_URL}/verify-user/${randomKey}`;

    const messageData = {
      from: "Test Support <support@mail.Test.com>",
      to: findUser.email,
      subject: "Confirm your Test account",
      template: "Confirm your Test account",
      "v:verify_url": verifyURL
    };

    const API_KEY = process.env.MAILGUN_API_KEY;
    const DOMAIN = process.env.MAILGUN_DOMAIN;

    const mailgun = new Mailgun(formData);
    const client = mailgun.client({ key: API_KEY, username: "api" });

    client?.messages
      .create(DOMAIN, messageData)
      .then((sendResponse) => {
        console.log("sendResponse", sendResponse);
      })
      .catch((sendError) => {
        console.error("sendError", sendError);
      });

    return res.status(201).json({
      status: true,
      message: "Verification link sent to your email successfully. Please check your email to verify."
    });
  } catch (error) {
    console.log("error", error);
  }
};

//Verify user
const verifyUser = async (req, res) => {
  try {
    const metakey = req.params.key;

    const user = await userModel.findOne({ metaKeyVerify: metakey })

    if (user.is_verified === true) {
      return res.status(403).json({
        status: true,
        message: "Your user account already verified"
      })
    }

    if (user) {
      const verifyUserEmail = await userModel.updateOne(
        { metaKeyVerify: metakey },
        { $set: { is_verified: true } },
        { new: true }
      );

      res.status(200).json({
        status: true,
        message: "Account confirmed. Thank you!"
      });

      if (verifyUserEmail.modifiedCount === 1) {
        const messageData = {
          from: "Test Support <support@mail.Test.com>",
          to: user.email,
          subject: "Welcome to Test. Account Registration Complete.",
          template: "welcome to Test",
          'v:redirect_to_application': process.env.CLIENT_URL
        };

        const API_KEY = process.env.MAILGUN_API_KEY;
        const DOMAIN = process.env.MAILGUN_DOMAIN;

        const mailgun = new Mailgun(formData);
        const client = mailgun.client({ key: API_KEY, username: "api" });

        client?.messages
          .create(DOMAIN, messageData)
          .then((sendResponse) => {
            console.log("sendResponse", sendResponse);
          })
          .catch((sendError) => {
            console.error("sendError", sendError);
          });
      }
    } else {
      return res.status(500).json(USER_NOT_FOUND)
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(INTERNAL_SERVER_ERROR);
  }
};

//handle user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    validateLoginInputs({ email, password });

    const user = await userModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(403).json({ message: "Invalid email or password" });
    }

    if (user.is_verified) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(403).json({ message: "Invalid email or password" });
      }

      const notificationDetails = await setEmailNotification(user, req, res);
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

      user.tokens.push({ token, createdAt: new Date() });
      await user.save();

      return res.status(200).json({
        status: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          user_profile_pic: user.user_profile_pic,
          accessToken: token,
        },
        notificationDetails: notificationDetails
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "You have not verified your email account. Click on the button to resend the verification email."
      })
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(INTERNAL_SERVER_ERROR);
  }
};

const verifyUserAccessTimeLimit = async (req, res) => {
  try {
    const data = await userModel.findOne({ metaKeyVerify: req.params.key }).lean();

    if (!data) {
      return res.status(403).json(ER_KEY_EXPIRED);
    }

    if (new Date(data?.timeLimitFogot) <= new Date()) {
      return res.status(403).json(ER_KEY_EXPIRED);
    }

    return res.status(201).json({
      status: true,
      message: "Key verified",
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(INTERNAL_SERVER_ERROR);
  }
};

const verifyAccessTimeLimit = async (req, res) => {
  try {
    const data = await userModel.findOne({ metaKeyForgot: req.params.key }).lean();

    if (data?.is_updated_password === true) {
      return res.status(403).json({
        status: true,
        message: "Using this link, Your password has been reset."
      })
    }

    if (!data) {
      return res.status(403).json(ER_KEY_EXPIRED);
    }

    if (new Date(data?.timeLimitFogot) <= new Date()) {
      return res.status(403).json(ER_KEY_EXPIRED);
    }

    return res.status(201).json({
      status: true,
      message: "Key verified",
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(INTERNAL_SERVER_ERROR);
  }
};

//handle forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email: email.toLowerCase() });

    const authorizationResult = await userAuthorzization(user._id, req.userRrole, res)

        if (!authorizationResult.status) {
            return res.status(authorizationResult.statusCode).json({
                status: false,
                message: authorizationResult.message
            });
        }

    if (!user) {
      return res.status(404).json(USER_NOT_FOUND);
    }

    let resetToken = generateToken(user.id);
    const token = await userModel.findOne({ resetToken });
    if (token) {
      await token.deleteOne();
      resetToken = generateToken(user.id);
    } else {
      resetToken = generateToken(user.id);
    }

    user.resetToken = resetToken;
    await user.save();

    const characters = user._id.toString();
    
    const randomKey = generateString(5, characters);

    const now = new Date();
    now.setHours(now.getHours() + 2);
    user.timeLimitFogot = now;

    user.is_updated_password = false;
    user.metaKeyForgot = randomKey;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${randomKey}`;

    const messageData = {
      from: "Test Support <support@mail.Test.com>",
      to: email,
      subject: "Test Password Reset",
      template: "Test password reset",
      'v:reset_password_url': resetUrl,
      'v:user_name': user.username
    };

    const API_KEY = process.env.MAILGUN_API_KEY;
    const DOMAIN = process.env.MAILGUN_DOMAIN;

    const mailgun = new Mailgun(formData);
    const client = mailgun.client({ key: API_KEY, username: "api" });

    client?.messages
      .create(DOMAIN, messageData)
      .then((sendResponse) => {
        console.log("sendResponse", sendResponse);
      })
      .catch((sendError) => {
        console.error("sendError", sendError);
      });

    res.status(200).json({
      status: true,
      message: `A link to reset your password has been sent to your email`,
      resetToken: resetToken,
    });
  } catch (error) {
    console.error("error", error);
    return res.status(500).json(INTERNAL_SERVER_ERROR);
  }
};

// handle reset password
const resetPassword = async (req, res) => {
  try {
    const user = await userModel.findOne({ metaKeyForgot: req.body.key });

    const authorizationResult = await userAuthorzization(user._id, req.userRrole, res)

        if (!authorizationResult.status) {
            return res.status(authorizationResult.statusCode).json({
                status: false,
                message: authorizationResult.message
            });
        }

    if (!user) {
      return res.status(403).json(USER_NOT_FOUND);
    }

    const isMatchNewPwd = await bcrypt.compare(req.body.password, user.password);
    if (isMatchNewPwd) {
      return res.status(403).json({ message: "Your new password matches the old one" })
    }

    const dataSolt = 10;
    const hashPwd = await bcrypt.hash(req.body.password, dataSolt);

    const updatedUser = await userModel.findByIdAndUpdate(user._id, { $set: { password: hashPwd, is_updated_password: true } });
    if (!updatedUser) {
      return res.status(403).json(UNABLE_CHANGE_PASSWORD)
    }

    await user.save();
    return res.status(201).json({ status: true, message: "Password Reset successfully. Please try to login.", data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json(INTERNAL_SERVER_ERROR);
  }
};

// handle verify token
const verifyToken = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await userModel.findOne({ resetToken: token });
    if (!user) {
      return res.status(401).json(INVALID_TOKEN);
    }
    user.token = null;
    await user.save();
    res
      .status(200)
      .json({ status: true, tokenExpired: false, message: "valid token" });
  } catch (error) {
    console.error(error);
    res.status(500).json(INTERNAL_SERVER_ERROR);
  }
};


module.exports = {
  createUser,
  loginUser,
  userProfileSet,
  forgotPassword,
  resetPassword,
  verifyToken,
  verifyUser,
  verifyAccessTimeLimit,
  verifyUserAccessTimeLimit,
  verifyApi,
};
