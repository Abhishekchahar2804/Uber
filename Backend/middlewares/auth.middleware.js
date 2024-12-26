const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const blacklistTokenModel = require('../models/blacklistToken.model');
dotenv.config();

module.exports.authUser = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization.split(' ')[1];

        if (!token) {
            throw new Error('Unauthorized');
        }

        const isBlacklisted = await blacklistTokenModel.findOne({ token: token });

        if (isBlacklisted) {
            throw new Error('Unauthorized');
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decodedToken._id);

        if (!user) {
            throw new Error('Unauthorized');
        }

        req.user = user;
        next();
    }
    catch (error) {
        //console.log(error);
        res.status(401).json({ error: error.message });
    }
}