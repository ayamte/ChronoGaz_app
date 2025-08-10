// controllers/truckController.js
const Truck = require('../models/Truck');
require('../models/Depot');
require('../models/Region');

/**
 * @desc    Créer un nouveau camion
 * @route   POST /api/trucks
 * @access  Private (e.g., admin)
 */
const createTruck = async (req, res) => {
  try {
    const newTruck = new Truck(req.body);
    const savedTruck = await newTruck.save();
    res.status(201).json({ 
      success: true, 
      message: 'Camion créé avec succès',
      data: savedTruck 
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Une erreur de doublon existe : la matricule doit être unique.',
        error: error.message
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Récupérer tous les camions avec filtres et pagination
 * @route   GET /api/trucks
 * @access  Private (e.g., admin)
 */
const getTrucks = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, region_id, depot_attache_id, disponible } = req.query;

    const filters = {};

    // Filtre par recherche (matricule, marque ou modele)
    if (search) {
      filters.$or = [
        { matricule: { $regex: search, $options: 'i' } },
        { marque: { $regex: search, $options: 'i' } },
        { modele: { $regex: search, $options: 'i' } },
      ];
    }
    
    // Filtres optionnels
    if (region_id) filters.region_id = region_id;
    if (depot_attache_id) filters.depot_attache_id = depot_attache_id;
    if (disponible) filters.disponible = disponible === 'true';

    const trucks = await Truck.find(filters)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('region_id', 'nom') // Peuple la région, en sélectionnant le nom
      .populate('depot_attache_id', 'nom') // Peuple le dépôt
      .sort({ createdAt: -1 });

    const count = await Truck.countDocuments(filters);

    res.status(200).json({
      success: true,
      data: trucks,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Récupérer un seul camion par ID
 * @route   GET /api/trucks/:id
 * @access  Private (e.g., admin)
 */
const getTruck = async (req, res) => {
  try {
    const truck = await Truck.findById(req.params.id)
      .populate('region_id', 'nom')
      .populate('depot_attache_id', 'nom');

    if (!truck) {
      return res.status(404).json({ success: false, message: 'Camion non trouvé' });
    }

    res.status(200).json({ success: true, data: truck });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Mettre à jour un camion par ID
 * @route   PUT /api/trucks/:id
 * @access  Private (e.g., admin)
 */
const updateTruck = async (req, res) => {
  try {
    const truck = await Truck.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Renvoie le document mis à jour
      runValidators: true, // Applique les validateurs du schéma
    });

    if (!truck) {
      return res.status(404).json({ success: false, message: 'Camion non trouvé' });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Camion mis à jour avec succès',
      data: truck 
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Une erreur de doublon existe : la matricule doit être unique.',
        error: error.message
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Supprimer un camion par ID
 * @route   DELETE /api/trucks/:id
 * @access  Private (e.g., admin)
 */
const deleteTruck = async (req, res) => {
  try {
    const truck = await Truck.findByIdAndDelete(req.params.id);

    if (!truck) {
      return res.status(404).json({ success: false, message: 'Camion non trouvé' });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Camion supprimé avec succès',
      data: {} // ou le camion supprimé si vous le souhaitez
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
    deleteTruck,
    updateTruck,
    getTruck,
    getTrucks,
    createTruck
}