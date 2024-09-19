const jwt = require("jsonwebtoken");
const { UNAUTHORIZED_USER } = require("../constants/error.constant");

const userOnly = (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (token && token.split(" ").length === 2) {
            const expiresIn = '7d'
            token = token.split(" ")[1];
            let user = jwt.verify(token, process.env.JWT_SECRET, { expiresIn });
            req.userId = user.id;
        } else {
            return UNAUTHORIZED_USER
        }
        next();
    } catch (err) {
        return UNAUTHORIZED_USER
    }
};

const adminAuth = (req, res, next) => {
    try {
        let token = req.headers.authorization;
        const expiresIn = '24h';
        if (token && token.split(" ").length === 2) {
            token = token.split(" ")[1];
            let decoded = jwt.verify(token, process.env.JWT_SECRET, { expiresIn });
            req.adminId = decoded.adminData?.id;
            req.userRole = decoded.adminData?.role;

            const currentTime = Math.floor(Date.now() / 1000);
            if (decoded.exp <= currentTime) {
                return res.status(401).json({ message: 'Token expired' });
            }
        } else {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        next();
    } catch (err) {
        console.log("err", err)
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports = { userOnly, adminAuth };
