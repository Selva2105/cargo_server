const CustomError = require("../utils/CustomError");

// 1. Function to send Development error
const devErrors = (res, error) => {
    res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
        stackTrace: error.stack,
        error: error
    });
}

// 1. Function to send Production error
const produtionError = (res, error) => {

    // to prevent not to show the user if it has any program errors created by developer
    if (error.isOperational) {
        res.status(error.statusCode).json({
            status: error.statusCode,
            message: error.message
        });
    } else {
        res.status(500).json({
            status: 'error',
            message: "Something went worng please try again later"
        })
    }

}

// 3. Function to handle casting error
const castErrorHandler = (err) => {
    const msg = `Invalid value for ${err.path}: ${err.value} !`;
    return new CustomError(msg, 400);
}

// 3. Function to handle duplicate key error
const duplicateKeyErrorHandler = (err) => {
    let msg;

    if (err.keyValue.name) {
        msg = `There is already a parking with name : ${err.keyValue.name} exists. Please use diffrent name !`;
    }
    if (err.keyValue.email) {
        msg = `There is already a user with email ${err.keyValue.email} exists. Please use diffrent email !`;
    }

    return new CustomError(msg, 400)
}

// 3. Function to handle validation error
const validationErrorHandler = (err) => {
    const erros = Object.values(err.errors).map(val => val.message);
    const errorMessages = erros.join(", ");
    const msg = `Invalid input data : ${errorMessages}`;
    return new CustomError(msg, 400);
}

// 3. Function to handle Expired JWT error
const handleExpiredJWT = (err) => {
    return new CustomError('JWT has expired. Please login again!', 401)
}

// 3. Function to handle JWT error
const handleJWTError = (err) => {
    return new CustomError('Invalid token. Please login again!', 401)
}



module.exports = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    if (process.env.NODE_ENV === 'development') {

        // ==== DEVELOPMENT ERRROR HANDLER ==== //
        devErrors(res, error);

    } else if (process.env.NODE_ENV === 'production') {
        // Handle errors

        // => Casting from one variable to another variable error
        if (error.name === "CastError") error = castErrorHandler(error);

        // => If any duplicate key is find handle 
        if (error.code === 11000) error = duplicateKeyErrorHandler(error);

        // => Handling validation error
        if (error.name === "ValidationError") error = validationErrorHandler(error);

        // => Token created for JWT Token if expired handling
        if (error.name === "TokenExpiredError") error = handleExpiredJWT(error);

        // => JWT Token expires error handling
        if (error.name === "JsonWebTokenError") error = handleJWTError(error);

        // ==== PRODUCTION ERRROR HANDLER ==== //
        produtionError(res, error);
    }

}