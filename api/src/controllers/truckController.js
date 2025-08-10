const Truck = require('../models/Truck');

// Récupérer tous les camions
exports.getAllTrucks = async (req, res) => {
  try {
    const { status, region, depot, active } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (region) filter.region = region;
    if (depot) filter.depot = depot;
    if (active !== undefined) filter.active = active === 'true';

    const trucks = await Truck.find(filter)
      .populate('driver', 'name email')
      .sort({ registrationNumber: 1 });
    
    res.status(200).json({
      success: true,
      count: trucks.length,
      data: trucks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Récupérer un camion par ID
exports.getTruckById = async (req, res) => {
  try {
    const truck = await Truck.findById(req.params.id)
      .populate('driver', 'name email phone');
    
    if (!truck) {
      return res.status(404).json({
        success: false,
        error: 'Camion non trouvé'
      });
    }
    
    res.status(200).json({
      success: true,
      data: truck
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Créer un nouveau camion
exports.createTruck = async (req, res) => {
  try {
    const truck = await Truck.create(req.body);
    
    res.status(201).json({
      success: true,
      data: truck
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Un camion avec ce numéro d\'immatriculation existe déjà'
      });
    }
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Mettre à jour un camion
exports.updateTruck = async (req, res) => {
  try {
    const truck = await Truck.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('driver', 'name email');
    
    if (!truck) {
      return res.status(404).json({
        success: false,
        error: 'Camion non trouvé'
      });
    }
    
    res.status(200).json({
      success: true,
      data: truck
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Un camion avec ce numéro d\'immatriculation existe déjà'
      });
    }
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Supprimer un camion (désactivation logique)
exports.deleteTruck = async (req, res) => {
  try {
    const truck = await Truck.findByIdAndUpdate(
      req.params.id,
      { active: false, status: 'Hors service' },
      { new: true }
    );
    
    if (!truck) {
      return res.status(404).json({
        success: false,
        error: 'Camion non trouvé'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Camion désactivé avec succès',
      data: truck
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Mettre à jour le statut d'un camion
exports.updateTruckStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const truck = await Truck.findById(req.params.id);
    if (!truck) {
      return res.status(404).json({
        success: false,
        error: 'Camion non trouvé'
      });
    }
    
    await truck.updateStatus(status);
    
    res.status(200).json({
      success: true,
      data: truck
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Assigner un chauffeur à un camion
exports.assignDriver = async (req, res) => {
  try {
    const { driverId } = req.body;
    
    const truck = await Truck.findByIdAndUpdate(
      req.params.id,
      { driver: driverId },
      { new: true, runValidators: true }
    ).populate('driver', 'name email phone');
    
    if (!truck) {
      return res.status(404).json({
        success: false,
        error: 'Camion non trouvé'
      });
    }
    
    res.status(200).json({
      success: true,
      data: truck
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Récupérer les camions par région
exports.getTrucksByRegion = async (req, res) => {
  try {
    const { region } = req.params;
    
    const trucks = await Truck.find({ region, active: true })
      .populate('driver', 'name email')
      .sort({ status: 1, registrationNumber: 1 });
    
    const stats = {
      total: trucks.length,
      disponible: trucks.filter(t => t.status === 'Disponible').length,
      enLivraison: trucks.filter(t => t.status === 'En livraison').length,
      enMaintenance: trucks.filter(t => t.status === 'En maintenance').length,
      horsService: trucks.filter(t => t.status === 'Hors service').length
    };
    
    res.status(200).json({
      success: true,
      region,
      stats,
      data: trucks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Récupérer les camions nécessitant une maintenance
exports.getMaintenanceDueTrucks = async (req, res) => {
  try {
    const trucks = await Truck.find({ active: true })
      .populate('driver', 'name email phone');
    
    const maintenanceDue = trucks.filter(truck => truck.isMaintenanceDue());
    
    res.status(200).json({
      success: true,
      count: maintenanceDue.length,
      data: maintenanceDue
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Mettre à jour le kilométrage
exports.updateMileage = async (req, res) => {
  try {
    const { mileage } = req.body;
    
    if (mileage < 0) {
      return res.status(400).json({
        success: false,
        error: 'Le kilométrage ne peut pas être négatif'
      });
    }
    
    const truck = await Truck.findById(req.params.id);
    if (!truck) {
      return res.status(404).json({
        success: false,
        error: 'Camion non trouvé'
      });
    }
    
    if (mileage < truck.mileage) {
      return res.status(400).json({
        success: false,
        error: 'Le nouveau kilométrage ne peut pas être inférieur à l\'ancien'
      });
    }
    
    truck.mileage = mileage;
    await truck.save();
    
    res.status(200).json({
      success: true,
      data: truck
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
