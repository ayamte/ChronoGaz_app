const express = require('express');  
const { getProfile, updateProfile } = require('../controllers/userController');  
const { authenticateToken } = require('../middleware/authMiddleware');  
  
const router = express.Router();  
  
// Route pour récupérer le profil de l'utilisateur connecté  
router.get('/profile', authenticateToken, getProfile);  
  
// Route pour mettre à jour le profil de l'utilisateur connecté  
router.put('/profile', authenticateToken, updateProfile);  
  
module.exports = router;