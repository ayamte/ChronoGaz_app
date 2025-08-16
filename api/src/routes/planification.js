const express = require('express');  
const { getPlanifications, getPlanificationById } = require('../controllers/planificationController');  
const { authenticateToken } = require('../middleware/authMiddleware');  
  
const router = express.Router();  
  
// GET /api/planifications  
router.get('/', authenticateToken, getPlanifications);  
  
// GET /api/planifications/:id  
router.get('/:id', authenticateToken, getPlanificationById);  
  
module.exports = router;