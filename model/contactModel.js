const mongoose = require('mongoose');
const validator = require('validator');

const contactSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "First name is missing"]
        },
        lastName: {
            type: String,
            required: [true, "Last name is missing"]
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: false,
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
        message: {
            type: String,
            required: [true, "Message is required"],
            minlength: [10, "Minimum 10 characters required"],
            maxlength: [30, "Max only 30 characters allowed"],
        }
    },
    {
        timestamps: true
    }
);

// Pre-save middleware to concatenate firstName and lastName into name field
contactSchema.pre('save', async function (next) {
    this.name = `${this.firstName} ${this.lastName}`;
    next();
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
