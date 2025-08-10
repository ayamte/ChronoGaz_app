const express = require('express');
const router = express.Router();
const { getAllRegions } = require('../controllers/regionController');

router.get('/', getAllRegions);

module.exports = router;
