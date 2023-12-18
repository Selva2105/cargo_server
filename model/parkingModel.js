const mongoose = require('mongoose');
const validator = require('validator');

const addressSchema = mongoose.Schema({
    doorNo: {
        type: String,
        required: [true, "Door number is required"]
    },
    street: {
        type: String,
        required: [true, "Street is required"]
    },
    area: {
        type: String,
        required: [true, "Area is required"]
    },
    district: {
        type: String,
        required: [true, "District is required"]
    },
    pincode: {
        type: Number,
        required: [true, "Pincode is required"],
        validate: {
            validator: function (value) {
                return validator.isInt(String(value), { min: 100000, max: 999999 });
            },
            message: 'Invalid pincode format'
        }
    }
});

const parkingSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Parking is required"],
            unique: true
        },
        address: {
            type: [addressSchema],
            required: [true, "Address is required"]

        },
        cost: {
            type: Number,
            required: [true, "Cost is required"],
            validate: {
                validator: function (value) {
                    return validator.isFloat(String(value), { min: 0 });
                },
                message: 'Price must be a positive number'
            }
        },
        discount: {
            type: Number,
            required: [true, "Discount is required"],
            validate: {
                validator: function (value) {
                    return validator.isFloat(String(value), { min: 0 });
                },
                message: 'Discount must be a positive number'
            }
        },
        finalDiscountedPrice: {
            type: Number,
            validate: {
                validator: function (value) {
                    return validator.isFloat(String(value), { min: 0 });
                },
                message: 'Discount must be a positive number'
            }
        },
        rules: {
            type: [
                {
                    type: String,
                    minlength: [2, 'Minimum 2 rules required']
                }
            ],
            validate: {
                validator: function (value) {
                    return value.length <= 6;
                },
                message: 'Maximum 7 rules allowed'
            },
            required: [true, "Rules are required"],
        },
        availability: {
            type: Number,
            required: [true, "Number of slots available is required"],
            min: [1, 'Minimum availability is 1'],
            max: [15, 'Maximum availability is 15']
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, "Owner reference required"],
        },
        mapLink: {
            type: String,
            required: [true, "Map link required"],
            validate: {
                validator: function (value) {
                    return validator.isURL(value);
                },
                message: 'Invalid map link format'
            }
        },
        lastUpdate: {
            type: Date,
            default: Date.now()
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

parkingSchema.virtual('costInPaise').get(function () {
    return this.cost * 100;
})

// Mongoose middleware to round down float numbers to integers before saving
parkingSchema.pre('save', function (next) {
    if (this.isModified('cost')) {
        this.cost = Math.floor(this.cost);
    }
    if (this.isModified('discount')) {
        this.discount = Math.floor(this.discount);
    }

    this.lastUpdate = Date.now();
    next();
});

// Mongoose middleware to calculte the final discounted price from cost and discount
parkingSchema.methods.generateFinalDiscountedPrice = async function (cost, discount) {
    if (!discount || !cost) {
        return false;
    }

    const discountedPrice = cost - (cost * (discount / 100));
    const roundedPrice = Math.round(discountedPrice);

    return roundedPrice;
}


// Create the Parking model using the schema
const Parking = mongoose.model('Parking', parkingSchema);

// Export the Parking model
module.exports = Parking;
