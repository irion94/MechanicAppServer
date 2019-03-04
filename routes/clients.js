/**
 * CRUD
 * @type {createApplication}
 */

const express = require('express');
const router = express.Router();
const createClient = require('../controllers/ClientController').create;
const getUser = require('../controllers/ClientController').read;
const update = require('../controllers/ClientController').update;
const Client = require('../models/client');


// Create Insert new Client
router.post('/', createClient);

//Read Clients
router.get('/', getUser);

//Update
router.post('/update', update);



module.exports = router;