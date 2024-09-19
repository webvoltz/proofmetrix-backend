const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String,
        required: false
    },
    password: {
        type: String,
    },
    resetToken: {
        type: String,
        required: false
    },
    metaKeyForgot: {
        type: String
    },
    metaKeyVerify: {
        type: String
    },
    timeLimitFogot: {
        type: Date
    },
    timeLimitVerify: {
        type: Date
    },
    resetTokenCreatedAt: {
        type: Date
    },
    tokens: [{
        token: { type: String },
        createdAt: { type: Date, default: Date.now() }
    }],
    is_updated_password: { type: Boolean, default: false },
    website: { type: String, default: "" },
    phone_num: { type: Number, default: null },
    country_code: { type: String, default: "" },
    user_profile_pic: { type: String, default: "" },
    is_verified: { type: Boolean, default: true },
    updated_email: { type: String, default: "" },
}, { timestamps: true });

const userModel = mongoose.model('user', UserSchema);
module.exports = userModel;