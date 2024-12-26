const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const { validationResult } = require('express-validator');

module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            throw new Error('Form is not completed');
        }
        const isUserAlready = await userModel.findOne({ email });

        if (isUserAlready) {
            throw new Error('User already exist' );
        }

        const hashPassword = await userModel.hashPassword(password);
        const user = await userModel.create({
            fullName: {
                firstName: fullName.firstName,
                lastName: fullName.lastName
            },
            email,
            password: hashPassword
        });

        const token = await user.generateAuthToken();
        res.status(201).json({ user, token });

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }

}

module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error('Form is not completed');
        }

        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            throw new Error('Invalid email or password');
        }

        const token = await user.generateAuthToken();
        res.status(200).json({ user, token });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
}

module.exports.getProfile = async (req, res, next) => {
    try {
        res.status(200).json({ user: req.user });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
}

module.exports.logoutUser = async (req, res, next) => {

    const token = req.cookies.token || req.headers.authorization.split(' ')[1];

    await blackListTokenModel.create({ token });
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out' });

}