// Dans votre route des statuts
const Statut = require('../models/StatutCommande');


const getStatuts = async (req, res) => {
    try {
      const statuts = await Statut.find();
      res.json({ success: true, data: statuts });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  module.exports = { getStatuts };
