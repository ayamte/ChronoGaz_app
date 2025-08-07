const express = require('express');  
const { getProfile, updateProfile } = require('../controllers/userController');  
const { authenticateToken } = require('../middleware/authMiddleware');  
const { changePassword } = require('../controllers/passwordController');
const { changeFirstLoginPassword } = require('../controllers/firstLoginController');  
  
  
const router = express.Router();  
  
// Route pour récupérer le profil de l'utilisateur connecté  
router.get('/profile', authenticateToken, getProfile);  
  
// Route pour mettre à jour le profil de l'utilisateur connecté  
router.put('/profile', authenticateToken, updateProfile);  

// Route pour changer le mot de passe
router.put('/change-password', authenticateToken, changePassword);

// Route pour le changement de mot de passe obligatoire à la première connexion  
router.put('/first-login-password', authenticateToken, changeFirstLoginPassword);
  
module.exports = router;

