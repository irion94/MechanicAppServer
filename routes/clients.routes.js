/**
 * CRUD
 * @type {createApplication}
 */

const express = require('express');
const router = express.Router();
// const createClient = require('../controllers/clients.controller').create;
// const getUsers = require('../controllers/clients.controller').readAll;
const getUser = require('../controllers/clients.controller').readOne;
// const updateUser = require('../controllers/clients.controller').update;
//const update = require('../controllers/clients.controller').update;
//const scanner = require('../controllers/clients.controller').createFromScanner;
const Client = require('../models/document.model');


//Read Clients
router.get('/one', getUser); //find one REST
// router.get('/all/:userId', getUsers); //find all //UserID
// router.post('/', createClient);
//
// router.put('/update', updateUser);



module.exports = router;