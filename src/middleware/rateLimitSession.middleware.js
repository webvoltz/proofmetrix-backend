const setRateLimit = require("express-rate-limit");

const limiter = setRateLimit({
    windowMs: 1 * 60 * 60* 1000,
    max: 10,
    message: "You have exceeded your 10 sessions per hour limit.",
    headers: true,
    keyGenerator: function (req) {
        return req.body.ipAddress;
    }
});

module.exports = limiter;