module.exports = {
    INTERNAL_SERVER_ERROR: {
        status: 500,
        message: "Internal server error."
    },
    INVALID_USER_ID: {
        status: 500,
        message: "Invalid user ID format."
    },
    FAIL_TO_FETCH_DETAILS: {
        status: 400,
        message: "Failed to fetch user details."
    },
    USER_NOT_FOUND: {
        status: 404,
        message: "User not found"
    },
    EMAIL_ALREADY_USE: {
        status: 403,
        message: "The email entered is already in use, please use a different one."
    },
    INCORRECT_PASSWORD:{
        status: 400,
        message: "Password not match with old password"
    }, 
    SAME_PASSWORD: {
        status: 400, 
        message: "Password can't be same as old password"
    }, 
    UNABLE_CHANGE_PASSWORD: {
        status: 400,
        message: "Unable to change password."
    },
    SUCCESS_PASSWORD: {
        status: 200,
        message: "Your password has been changed!"
    },
    NOTIFICATION_NOT_FOUND: {
        status: 404,
        message: "We couldn't find details for this notification."
    },
    DETAILS_NOT_FOUND_FOR_NOTIFICATION: {
        status: 404,
        message: "Notification details not found for the user"
    },
    EXISTING_URL: {
        status: 404,
        message: "Existing URL does not match"
    },
    TRACKING_ERROR: {
        status: 500,
        message: "Error tracking home page visit"
    },
    UNABLE_TO_STORE_SESSION: {
        status: 500,
        message: "We're unable to store your session"
    },
    REFERRAL_IP_ERROR: {
        status: 500,
        message: 'An error while saving the referral source IP address.'
    },
    INCORRECT_EMAIL_PASSWORD: {
        status: 403,
        message: "Email or Passsword is incorrect."
    },
    INVALID_TOKEN: {
        status: 401,
        message: "The token is invalid or has expired."
    },
    WIDGET_NOT_FOUND: {
        status: 404,
        message: "No published widget found."
    }, 
    ITEM_NOT_FOUND: {
        status: 404,
        message: "No items found."
    },
    ITEM_NOT_FOUND_WIDGET: {
        status: 404,
        message: "The requested item was not found in the widget."
    },
    USER_ID_MISSING: {
        status: 400,
        message: "The user ID is missing."
    },
    UNAUTHORIZED_USER: {
        status: 401,
        message: "Unauthorized User"
    },
    TEST_NOT_FOUND: {
        status: 404,
        message: "Test not found"
    },
    ER_KEY_EXPIRED: {
        status: 403,
        message: "The key has been expired. Please request for new one."
    }
}