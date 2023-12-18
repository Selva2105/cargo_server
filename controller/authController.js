const crypto = require('crypto');

const sendEmail = require('../utils/Email');
const signToken = require('../utils/SignToken');
const { User } = require('../model/userModel');
const asyncErrorhandler = require('../utils/asyncErrorhandler');
const CustomError = require("../utils/CustomError");


const signup = asyncErrorhandler(async (req, res, next) => {

    // 1. Check the user role 
    const { role } = req.body;

    if (role !== 'user' && role !== 'dev') {
        const error = new CustomError('The only roles you can choose are user or dev', 500);
        return next(error);
    }

    // 2. Create new user
    const newUser = await User.create(req.body);

    // 3. Generate access token and verify token and save it in the DB
    const token = signToken(newUser._id);
    const verifyToken = await newUser.generateUserVerifyToken();
    await newUser.save({ validateBeforeSave: false });

    // 4. Send the verify link through email
    const verifyUrl = `${req.protocol}://${req.get('host')}/api/v1/user/verify/${verifyToken}`;
    const message = `Please use the below link to verify your account \n\n ${verifyUrl} \n\n This link will be valid for only 10 minutes`

    try {

        await sendEmail({
            email: newUser.email,
            subject: 'Verify user from CarGo team',
            message
        });

    } catch (error) {
        console.log(error);
        newUser.userVerifyToken = undefined;
        newUser.userVerifyTokenExpire = undefined;
        await newUser.save({ validateBeforeSave: false });

        return next(new CustomError(`There was an error occured while sending user verify link ${error}`, 500))
    }

    // 5. Create the user
    res.status(201).json({
        status: 'success',
        message: 'User created. Check your mail and verify',
        token,
        data: {
            user: newUser
        }
    })

});

const verifyUser = asyncErrorhandler(async (req, res, next) => {
    // 1. Decrypting the token
    const decryptedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    // 2. Finding the user and checking if the user's token is still valid
    const user = await User.findOne({ userVerifyToken: decryptedToken, userVerifyTokenExpire: { $gt: Date.now() } });

    if (!user) {
        const error = new CustomError('Token is invalid or expired', 400);
        return next(error);
    }

    // 3. Change the verified status to TRUE
    user.userVerifyToken = undefined;
    user.userVerifyTokenExpire = undefined;
    user.verified = true;

    const updatedUser = await user.save({ validateBeforeSave: false });

    // 4. Check if the user's verified status has turned to true after saving changes
    if (updatedUser.verified) {
        return res.status(200).json({ message: 'User verified successfully' });
    } else {
        const error = new CustomError('User verification failed', 500);
        return next(error);
    }
});

const login = asyncErrorhandler(async (req, res, next) => {
    const { email, password } = req.body;


    // 1. Check both email and password is received from request
    if (!email || !password) {
        const error = new CustomError('Please provide email and password', 400);
        return next(error)
    }

    // 2. Find if user is exist and password match...
    const user = await User.findOne({ email }).select('+password'); // to get the password also use select

    if (!user || !(await user.comparePasswordInDb(password, user.password))) {
        const error = new CustomError('Incorrect email or password', 400);
        return next(error);
    }

    // 3. Generate the token for logging in
    const token = signToken(user._id);

    // 4. Send the token
    res.status(200).json({
        status: 'success',
        token,
    })

});

const forgotPassword = asyncErrorhandler(async (req, res, next) => {
    // 1. Get the user from the req email
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        const error = new CustomError('User not found with the given email', 404);
        next(error)
    }

    // 2. Generate a random reset token
    const resetToken = await user.generateResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // 3. Send the token back to the user email

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `We have received a password reset request .Please use the below link to reset your password \n\n ${resetUrl} \n\n This reset password link will be valid for only 10 minutes`

    try {

        await sendEmail({
            email: user.email,
            subject: 'Password reset link from CarGo team',
            message
        });


        res.status(200).json({
            status: 'success',
            message: `Password reset link sent to ${user.email}.`
        })

    } catch (error) {
        console.log(error);
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new CustomError('There was an error occured while sending password rest link', 500))
    }

})

const resetPassword = asyncErrorhandler(async (req, res, next) => {

    // 1. Decrypting the token
    const decryptedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    // 2. Finding the user and checking if the user's token is still valid
    const user = await User.findOne({ passwordResetToken: decryptedToken, passwordResetTokenExpire: { $gt: Date.now() } });

    if (!user) {
        const error = new CustomError('Token is invalid or expired', 400);
        next(error)
    }

    // 3. resetting the password
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpire = undefined;
    user.passwordChangedAt = Date.now();

    await user.save();

    // 4. After resetting password login the user again

    const loginToken = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token: loginToken
    })
})

module.exports = { login, signup, forgotPassword, resetPassword, verifyUser };
