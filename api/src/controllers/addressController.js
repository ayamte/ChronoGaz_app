const Address = require('../models/Address');

const createAddress = async (req, res) => {
        try {
          const newAddress = new Address(req.body);
          const saved = await newAddress.save();

          // Ici on récupère l'adresse avec les détails de la région
          const populateAddressWithRegion = await Address.findById(saved._id).populate('region_id');
      
          res.status(201).json({
            success: true,
            message: 'Adresse créée avec succès',
            data: populateAddressWithRegion
          });
        } catch (err) {
          console.error('Erreur création adresse:', err);
          res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la création de l\'adresse',
            error: err.message,
            details: err.errors
          });
          
        }
}

const getAddressById = async (req, res) => {
  try {
    const { id } = req.params;

    // Ici on récupère l'adresse avec les détails de la région
    const addressPopulate = await Address.findById(id).populate('region_id');

    res.status(200).json({
      success: true,
      message: 'Adresse créée avec succès',
      data: addressPopulate
    });
  } catch (err) {
    console.error('Erreur création adresse:', err);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création de l\'adresse',
      error: err.message,
      details: err.errors
    });
    
  }
}

module.exports = {
    createAddress,
    getAddressById
}