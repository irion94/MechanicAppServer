const express = require('express');
const router = express.Router();

const create = require('../controllers/document.controller').create;
const read = require('../controllers/document.controller').read;

router.post('/', create);
router.get('/:ids?', read); //find all //UserID

module.exports = router;