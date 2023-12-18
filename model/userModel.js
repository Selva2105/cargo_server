const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto')

const userSchema = mongoose.Schema(
    {
        userName: {
            type: String,
            required: [true, "User name is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please enter a valid email']
        },
        phoneNumber: {
            type: String,
            required: [true, "Phone Number is required"],
            validate: {
                validator: function (value) {
                    return /^\d{10}$/.test(value);
                },
                message: 'Phone number should be a 10-digit number'
            }
        },
        dob: {
            type: Date,
            required: [true, "Date of birth is required"],
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'dev', 'owner'],
            default: 'user'
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            min: 8,
            max: 15,
            select: false, //to aviod anyone to see the password in response
            validate: {
                validator: function (value) {
                    return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/.test(value);
                },
                message: "Provide a valid password"
            }
        },
        confirmPassword: {
            type: String,
            required: [true, "Confirm password is required"],
            validate: {
                validator: function (value) {
                    return value === this.password;
                },
                message: "Passwords don't match"
            }
        },
        verified: {
            type: Boolean,
            enum: [true, false],
            default: false
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetTokenExpire: Date,
        userVerifyToken: String,
        userVerifyTokenExpire: Date,
        lastUpdate: {
            type: Date,
            default: Date.now()
        },
        ownerRequest: Boolean
    },
    {
        timestamps: true
    }
);

// Password hashing
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    //encrypt the password befor creating it...
    this.password = await bcrypt.hash(this.password, 12);

    this.confirmPassword = undefined;
    this.lastUpdate = Date.now();
    next();
});

// To login the user compare the user password with db password
userSchema.methods.comparePasswordInDb = async function (password, passwordDb) {
    return await bcrypt.compare(password, passwordDb);
}

// To invalidate the user token after user modify their password
userSchema.methods.isPasswordModified = async function (JWTtimestamp) {
    if (this.passwordChangedAt) {

        const passwordChangedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTtimestamp < passwordChangedTimestamp;
    }
    return false;
}

// To generate token for the user to reset his/her password
userSchema.methods.generateResetPasswordToken = async function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    let expireTime = new Date();
    expireTime.setMinutes(expireTime.getMinutes() + 10);

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpire = expireTime;

    return resetToken;
}

// To generate token for the user verification
userSchema.methods.generateUserVerifyToken = async function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    let expireTime = new Date();
    expireTime.setMinutes(expireTime.getMinutes() + 10);

    this.userVerifyToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.userVerifyTokenExpire = expireTime;

    return resetToken;
}


const User = mongoose.model("User", userSchema);

module.exports = { User };
