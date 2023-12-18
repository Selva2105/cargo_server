const express = require('express');
const protect = require('../middleware/protectMiddleware');
const { restrict } = require('../middleware/rolesMiddlwware');
const { ownerConvertionRequest } = require('../controller/ownerController');

const router = express.Router();

router.route('/:id').patch(protect, restrict('user'), ownerConvertionRequest);

module.exports = router