const userModel = require("../models/auth")

const userAuthorzization = async (userId, role, res) => {
    try {
        const findUser = await userModel.findOne({ _id: userId })

        if (role !== "admin" && (findUser.isBlocked === true)) {
            return { status: false, statusCode: 401, message: "Unauthorized" };
        }

        return { status: true };
    } catch (error) {
        console.log("error", error)
    }
}

module.exports = { userAuthorzization }