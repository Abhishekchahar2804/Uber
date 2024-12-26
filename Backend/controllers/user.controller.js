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

        const hashPassword= await userModel.hashPassword(password);
        const user = await userModel.create({
            fullName: {
                firstName:fullName.firstName,
                lastName:fullName.lastName
            },
            email,
            password: hashPassword
        }); 

        const token=await user.generateAuthToken();
        res.status(201).json({ user, token });

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
    
}