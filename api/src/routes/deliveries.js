// routes/deliveries.js
const express = require("express");
const router = express.Router();
const {
  getDeliveries,
  getTodayDeliveries,
  getDeliveryById,
  startDelivery,
  updateDeliveryPosition,
  completeDelivery,
  getDeliveryTracking,
  getDeliveriesStats,
  getRealTimePosition
} = require("../controllers/deliveriesController");

// Routes pour les livraisons

// GET /api/deliveries - Obtenir toutes les livraisons planifiées
router.get('/', getDeliveries);

// GET /api/deliveries/stats - Obtenir les statistiques des livraisons
router.get('/stats', getDeliveriesStats);

// GET /api/deliveries/today - Obtenir les livraisons d'aujourd'hui
router.get('/today', getTodayDeliveries);

// GET /api/deliveries/:id - Obtenir une livraison spécifique
router.get('/:id', getDeliveryById);

// GET /api/deliveries/:id/track - Obtenir les données de suivi GPS
router.get('/:id/track', getDeliveryTracking);

// PUT /api/deliveries/:id/start - Démarrer une livraison
router.put('/:planificationId/start', startDelivery);

// PUT /api/deliveries/:id/position - Mettre à jour la position GPS
router.put('/:id/position', updateDeliveryPosition);

// PUT /api/deliveries/:id/complete - Terminer une livraison
router.put('/:id/complete', completeDelivery);

// Nouvelle route pour position temps réel
router.get('/:id/realtime-position', getRealTimePosition);

module.exports = router;