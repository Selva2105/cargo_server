const Parking = require("../model/parkingModel");
const CustomError = require("../utils/CustomError");
const asyncErrorhandler = require("../utils/asyncErrorhandler");
const Apifeatures = require("../utils/ApiFeatures");

const createParking = asyncErrorhandler(async (req, res, next) => {
    // 1. Create new parking slot
    const newParking = await Parking.create(req.body);

    // 2. Calculate the final discount price
    newParking.finalDiscountedPrice =
        await newParking.generateFinalDiscountedPrice(
            req.body.cost,
            req.body.discount
        );
    await newParking.save();

    // 3. Send response
    res.status(201).json({
        status: "success",
        message: "Parking created sucessfully.",
    });
});

const updateParking = asyncErrorhandler(async (req, res, next) => {
    // 1. Find the parking lot by id
    const { id } = req.params;
    let parking = await Parking.findById({ _id: id });

    // 2. If parking is not found return the response
    if (!parking) {
        const error = new CustomError(
            "Parking slot is not found. Please try different!",
            404
        );
        return next(error);
    }

    // 3. Check if there is any field to update the changed fields
    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
        const error = new CustomError(
            "Nothing to update.Please change some fields to perform this operation",
            400
        );
        return next(error);
    }
    // 4.Update the changes and change the last update to present time and change the final discount price and save the user
    else {
        parking = Object.assign(parking, req.body);
        parking.finalDiscountedPrice = await parking.generateFinalDiscountedPrice(
            req.body.cost,
            req.body.discount
        );
        await parking.save();
    }

    // 5. Respond the user
    res.status(200).json({
        status: "success",
        message: "Parking updated sucessfully",
    });
});

const deleteParking = asyncErrorhandler(async (req, res, next) => {
    // 1. Find the parking lot by id
    const { id } = req.params;
    let parking = await Parking.findById({ _id: id });

    // 2. If parking is not found return the response
    if (!parking) {
        const error = new CustomError("Parking slot not found.", 404);
        return next(error);
    }

    // 3. Delete the parking slot
    await Parking.findByIdAndDelete(id);

    res.status(200).json({
        status: "success",
        message: "Parking slot deleted successfully.",
    });
});

const getParkingController = asyncErrorhandler(async (req, res, next) => {
    // 1. Filter the data
    const features = new Apifeatures(Parking.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .pagenate();

    // 2. Await for the response from the instance of Apifeature class
    const slots = await features.query;

    // 3. Send the result to the client
    res.status(200).json({
        status: "success",
        length: slots.length,
        message: "Filtered data retrived successfully.",
        data: {
            slots,
        },
    });
});

const getHighestRated = asyncErrorhandler(async (req, res, next) => {
    req.query.limit = "5";
    req.query.sort = "-finalDiscountedPrice";

    next();
});

const getParkingStats = asyncErrorhandler(async (req, res, next) => {
    const stats = await Parking.aggregate([
        // Result from first stage will be taken to get the result of second stage
        { $match: { cost: { $gte: 40 } } },
        {
            $group: {
                _id: '$lastUpdate',
                avgCost: { $avg: '$cost' },
                avgDiscount: { $avg: '$discount' },
                minCost: { $min: '$cost' },
                maxCost: { $max: '$cost' },
                totalCost: { $sum: '$cost' },
                totalSlots: { $sum: 1 }
            }
        },
        {
            $sort: { minCost: 1 }
        },
        { $match: { maxCost: { $gte: 60 } } },
    ]);

    res.status(200).json({
        status: "success",
        length: stats.length,
        message: "Filtered data retrived successfully.",
        data: {
            stats,
        },
    });
})


const getParkingByLocation = asyncErrorhandler(async (req, res, next) => {


    const rules = req.params.rules;

    const slots = await Parking.aggregate([
        { $unwind: '$rules' },
        {
            $group: {
                _id: '$rules',
                pakingCount: { $sum: 1 },
                name: { $push: '$name' }
            }
        },
        { $addFields: { rule: "$_id" } },
        { $project: { _id: 0 } },
        { $sort: { pakingCount: -1 } },
        //{ $limit: 1 }
        //{ $match: { rules: rules } }
        
    ]);

    res.status(200).json({
        status: "success",
        length: slots.length,
        message: "Filtered data retrived successfully.",
        data: {
            slots,
        },
    });
})

module.exports = {
    createParking,
    updateParking,
    deleteParking,
    getParkingController,
    getHighestRated,
    getParkingStats,
    getParkingByLocation
};
