const express = require('express');  
const router = express.Router();  
const locationController = require('../controllers/LocationController');  
const { authenticateToken } = require('../middleware/authMiddleware');  
  
// Routes pour les villes  
router.get('/cities', locationController.getCities);  
router.post('/cities', authenticateToken, locationController.createCity);  
router.put('/cities/:id', authenticateToken, locationController.updateCity);  
router.delete('/cities/:id', authenticateToken, locationController.deleteCity);  
  
// Routes pour les régions  
router.get('/cities/:cityId/regions', locationController.getRegionsByCity);  
router.post('/regions', authenticateToken, locationController.createRegion);  
router.put('/regions/:id', authenticateToken, locationController.updateRegion);  
router.delete('/regions/:id', authenticateToken, locationController.deleteRegion);  
router.get('/regions', locationController.getAllRegions);
  
module.exports = router;