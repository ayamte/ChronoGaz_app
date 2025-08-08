const express = require('express');  
const { register, login } = require('../controllers/authController');  
const { forgotPassword, resetPassword } = require('../controllers/passwordResetController');  
const { verifyEmail, resendVerificationCode } = require('../controllers/emailVerificationController');  
  
const router = express.Router();  
  
// Route d'inscription  
router.post('/register', register);  
  
// Route de connexion  
router.post('/login', login);  



router.post('/forgot-password', forgotPassword);  
router.post('/reset-password', resetPassword);

// Routes de vérification d'email  
router.post('/verify-email', verifyEmail);  
router.post('/resend-verification', resendVerificationCode);

module.exports = router;