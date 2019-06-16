/**
 * CRUD
 * @type {createApplication}
 */

const express = require('express');
const router = express.Router();
const create = require('../controllers/RepairListController').create;
const update = require('../controllers/RepairListController').update;
const del = require('../controllers/RepairListController').delete;
//const read = require('../controllers/RepairListController').read;
//const getUser = require('../controllers/ClientController').getUser;


// POST Insert new Client
router.post('/', create);
router.put('/', update);
router.delete('/', del);

// router.get('/:id/:clientId?', read);

//GET Clients
//router.get('/', getUser);



module.exports = router;