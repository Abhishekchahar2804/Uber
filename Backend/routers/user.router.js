const express = require('express');

const {body} = require('express-validator');

const userController = require('../controllers/user.controller');

const { authUser } = require('../middlewares/auth.middleware');

const UserRouter = express.Router();

UserRouter.post('/register',[
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({min:5}).withMessage('Password must be at least 5 characters long'),
    body('fullName.firstName').isLength({min:3}).withMessage('First name must be at least 3 characters long'),
],userController.registerUser);

UserRouter.post('/login',[
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({min:5}).withMessage('Password must be at least 5 characters long'),
],userController.loginUser);


UserRouter.get('/profile',authUser,userController.getProfile);

UserRouter.get('/logout', authUser, userController.logoutUser)


module.exports = UserRouter;