// Router
const express = require('express');
const { createParking, updateParking, deleteParking, getParkingController, getHighestRated, getParkingStats, getParkingByLocation } = require('../controller/parkingController');
const protect = require('../middleware/protectMiddleware');
const { restrict } = require('../middleware/rolesMiddlwware');

const router = express.Router();

//Alias routes
router.route('/highestCost')
    .get(protect, getHighestRated, getParkingController)

// Aggregate routes
router.route('/parking-stats')
    .get(protect, getParkingStats)
router.route('/parking-by-location/:rules')
    .get(protect, getParkingByLocation)

// Protected and role based routes
router.route('/')
    .post(protect, restrict('admin', 'dev','owner'), createParking);

router.route('/:id')
    .patch(protect, restrict('admin', 'dev','owner'), updateParking)
    .delete(protect, restrict('admin', 'dev','owner'), deleteParking);

// Protected routes
router.route('/getFilteredCollections').get(protect, getParkingController);
// filter : {{BASEURL}}/api/v1/getFilteredCollections?availability[gte]=11&address[eq]=Pollachi&cost[lte]=20
// sort : {{BASEURL}}/api/v1/getFilteredCollections?sort=-cost [adding minus infront of field will sort in descending order]
// fields: {{BASEURL}}/api/v1/getFilteredCollections?fields=name,address,cost

module.exports = router;
