/**
 * CRUD
 * @type {createApplication}
 */

const express = require('express');
const router = express.Router();
const create = require('../controllers/RepairController').create;
const get = require('../controllers/RepairController').get;


// POST Insert new Client
router.post('/', create);

//GET Clients
router.get('/', get);



module.exports = router;