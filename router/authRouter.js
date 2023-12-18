const express = require('express');
const { login, signup, forgotPassword, resetPassword, verifyUser } = require('../controller/authController');

const router = express.Router();

// User Initial routes
router.route('/signup').post(signup);
router.route('/signin').post(login);
router.route('/user/verify/:token').post(verifyUser);

// Password Manipulation routes
router.route('/forgotPassword').post(forgotPassword)
router.route('/resetPassword/:token').patch(resetPassword)

module.exports = router