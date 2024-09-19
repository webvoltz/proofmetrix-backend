const mongoose = require('mongoose');

const emailNotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: "user"
    },
    dashboardSettings: {
        setSystemNotification: {
            type: Boolean,
            default: true
        },
        notificationEmail: {
            type: Array
        },
        frequency: {
            type: String,
            default: 'Daily'
        },
        dayOfFrequency: {
            type: String
        }
    },
    spiltTestSettings: {
        setSystemNotification: {
            type: Boolean,
            default: true
        },
        notificationEmail: {
            type: Array
        },
        frequency: {
            type: String,
            default: 'Daily'
        },
        dayOfFrequency: {
            type: String
        }
    }
}, { timestamps: true });

const emailNotificationModel = mongoose.model('email_notification', emailNotificationSchema);
module.exports = emailNotificationModel;