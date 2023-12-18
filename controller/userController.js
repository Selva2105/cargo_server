const { User } = require("../model/userModel");
const CustomError = require("../utils/CustomError");
const asyncErrorhandler = require("../utils/asyncErrorhandler");

const getUserDetailsById = asyncErrorhandler(async (req, res, next) => {

    // 1. Find if user exist if not throw the error
    const user = await User.findOne({ _id: req.params.id });

    if (!user) {
        const error = new CustomError("User not found", 404);
        return next(error)
    }

    // 2. Send the response
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
})

const getAllUserDetails = asyncErrorhandler(async (req, res, next) => {

    // 1. Get all the users
    const user = await User.find();

    // 2. Send them via response
    res.status(200).json({
        status: 'success',
        length: user.length,
        data: {
            user
        }
    })
});

const updateUserDetails = asyncErrorhandler(async (req, res, next) => {

    // 1. Get the user details from the id
    const { id } = req.params;

    let user = await User.findById({ _id: id });

    // 2. If user is not found return the response
    if (!user) {
        const error = new CustomError(
            "User not found. Please try different!",
            404
        );
        return next(error);
    }

    // 3. Fields that are not allowed to be updated by the user
    const disallowedFields = ['password', 'email', 'role', 'passwordChangedAt', 'passwordResetToken', 'passwordResetTokenExpire', 'userVerifyToken', 'userVerifyTokenExpire', 'verified'];

    // 4. Check if any disallowed fields are present in the request body
    const updates = Object.keys(req.body);
    const disallowedUpdates = updates.filter(update => disallowedFields.includes(update));

    // 5. If disallowed fields are found, send an error response
    if (disallowedUpdates.length > 0) {
        const error = new CustomError(
            `Updating ${disallowedUpdates.join(', ')} is not allowed.`,
            400
        );
        return next(error);
    }

    // 6. Update allowed fields only
    updates.forEach(update => {
        user[update] = req.body[update];
    });

    await user.save();

    // 7. Send success response
    res.status(201).json({
        status: 'success',
        message: 'User updated successfully'
    });
});

const deleteUser = asyncErrorhandler(async (req, res, next) => {

    // 1. Get the user details from the id
    const { id } = req.params;
    const { password } = req.body;

    let user = await User.findById({ _id: id }).select('+password');;

    // 2. If user is not found return the response
    if (!user) {
        const error = new CustomError(
            "User not found. Please try different!",
            404
        );
        return next(error);
    }

    // 3. Confirming the user by getting the user password
    if (!password) {
        const error = new CustomError(
            "Password field is missing. Please enter the password!",
            404
        );
        return next(error);
    }

    if (!(await user.comparePasswordInDb(password, user.password))) {
        const error = new CustomError('Incorrect Password.Please try again', 400);
        return next(error);
    }

    await User.findByIdAndDelete(id);

    // 7. Send success response
    res.status(200).json({
        status: 'success',
        message: 'User deleted successfully'
    });
})



module.exports = { getUserDetailsById, getAllUserDetails, updateUserDetails, deleteUser }