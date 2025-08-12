const express = require('express');
const router = express.Router();
const { getStatuts } = require('../controllers/statutController');

router.get('/', getStatuts);

module.exports = router;