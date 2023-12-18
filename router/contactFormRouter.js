const express = require('express');
const { createContactFormDetails, getContactFormDetails } = require('../controller/contactController');
const protect = require('../middleware/protectMiddleware');
const { restrict } = require('../middleware/rolesMiddlwware');

const router = express.Router();

router.route('/')
    .post(createContactFormDetails)
    .get(protect, restrict('admin', 'dev'),getContactFormDetails) //{{BASEURL}}/api/v1/contact?sort=-createdAt


module.exports = router;