const express = require('express');
const protect = require('../middleware/protectMiddleware');
const { restrict } = require('../middleware/rolesMiddlwware');
const { getAllUserDetails, getUserDetailsById, updateUserDetails, deleteUser } = require('../controller/userController');

const router = express.Router();

// Protected and restricted routes
router.route('/')
    .get(protect, restrict('admin', 'dev'), getAllUserDetails);

//Protected routes
router.route('/:id')
    .get(protect, getUserDetailsById)
    .patch(protect, updateUserDetails)
    .delete(deleteUser)



module.exports = router