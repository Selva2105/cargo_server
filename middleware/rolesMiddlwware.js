const CustomError = require("../utils/CustomError");

// Wrapper function is used bcoz we cannot send role as params other than req,res and next
const restrict = (...role) => {
    return (req, res, next) => {

        // 1. Check if user has the role exists in DB
        if (!role.includes(req.user.role)) {
            const error = new CustomError('You do not have the permission to perform this action', 403);
            next(error)
        }

        // 2. If exists Allow(auth) the user
        next();
    }
}

module.exports = { restrict };