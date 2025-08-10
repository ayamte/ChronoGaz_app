const express = require('express');
const router = express.Router();
const Address = require('../models/Address');
const {createAddress, getAddressById} = require('../controllers/addressController');

// POST /api/addresses
router.post('/', createAddress);
router.get('/:id', getAddressById);


module.exports = router;
