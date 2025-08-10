const express = require('express');
const router = express.Router();
const truckController = require('../controllers/truckController');

// Routes pour les camions
router.get('/', truckController.getAllTrucks);
router.get('/maintenance-due', truckController.getMaintenanceDueTrucks);
router.get('/region/:region', truckController.getTrucksByRegion);
router.get('/:id', truckController.getTruckById);
router.post('/', truckController.createTruck);
router.put('/:id', truckController.updateTruck);
router.patch('/:id/status', truckController.updateTruckStatus);
router.patch('/:id/driver', truckController.assignDriver);
router.patch('/:id/mileage', truckController.updateMileage);
router.delete('/:id', truckController.deleteTruck);

module.exports = router;
