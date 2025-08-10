const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const {getCleintById, getClientAddresses} = require('../controllers/customerController');

router.get('/:id', getCleintById);
router.get('/:id/addresses', getClientAddresses);

module.exports = router;
