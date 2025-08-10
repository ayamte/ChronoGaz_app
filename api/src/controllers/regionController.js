// controllers/regionController.js
const Region = require('../models/Region');

const getAllRegions = async (req, res) => {
  try {
    const regions = await Region.find({ actif: true });
    res.status(200).json(regions);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

module.exports = { getAllRegions };
