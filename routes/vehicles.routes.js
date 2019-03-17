/**
 *
 * @type {createApplication}
 */

const express = require('express');
const router = express.Router();
const insertVehicle  = require( '../controllers/vehicles.controller').create;
const getVehicle  = require( '../controllers/vehicles.controller').read;

//POST Create New User (NOT CUSTOMER!)
router.post('/', insertVehicle);

//GET Vehicle list
router.get('/', getVehicle);

module.exports = router;