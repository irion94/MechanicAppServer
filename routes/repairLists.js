/**
 * CRUD
 * @type {createApplication}
 */

const express = require('express');
const router = express.Router();
const create = require('../controllers/RepairListController').create;
const read = require('../controllers/RepairListController').read;
//const getUser = require('../controllers/ClientController').getUser;


// POST Insert new Client
router.post('/', create);

router.get('/:id/:clientId?', read);

//GET Clients
//router.get('/', getUser);



module.exports = router;