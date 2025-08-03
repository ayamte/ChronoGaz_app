const express = require('express');  
const { getClients, getEmployees, updateUser, deleteUser, createUser } = require('../controllers/adminController');  
const { requireAdmin } = require('../middleware/adminAuthMiddleware');  
  
const router = express.Router();  
  
// Routes pour lister  
router.get('/clients', requireAdmin, getClients);  
router.get('/employees', requireAdmin, getEmployees);  
  
// Routes pour gérer les utilisateurs  
router.post('/users', requireAdmin, createUser);  
router.put('/users/:userId', requireAdmin, updateUser);  
router.delete('/users/:userId', requireAdmin, deleteUser);  
  
module.exports = router;