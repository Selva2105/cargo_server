const Contact = require("../model/contactModel");
const Apifeatures = require("../utils/ApiFeatures");
const asyncErrorHandler = require("../utils/asyncErrorhandler");

const createContactFormDetails = asyncErrorHandler(async (req, res, next) => {
    const { firstName, lastName, email, phoneNumber, message } = req.body;

    // Create new contact form
    const contactForm = await Contact.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        message
    });

    // Send response
    res.status(201).json({
        status: "success",
        message: "Details sent successfully!",
        data: contactForm
    });
});

const getContactFormDetails = asyncErrorHandler(async (req, res, next) => {

    // 1.Filter the data
    const forms = new Apifeatures(Contact.find(), req.query)
        .sort()
    const contactForms = await forms.query

    res.status(200).json({
        status: "success",
        length: contactForms.length,
        message: "Forms retrived sucessfully",
        data: {
            contactForms
        }
    })
})

module.exports = { createContactFormDetails, getContactFormDetails };
