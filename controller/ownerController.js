const { User } = require("../model/userModel");
const asyncErrorhandler = require("../utils/asyncErrorhandler");

const ownerConvertionRequest = asyncErrorhandler(async (req, res, next) => {

    // 1. Get the user from the id
    const { id } = req.params;

    let user = await User.findById({ _id: id });

    res.status(200).json({
        status: 'success',
        message: 'Owner request sent !',
        data: {
            user
        }
    })

})

module.exports = { ownerConvertionRequest }