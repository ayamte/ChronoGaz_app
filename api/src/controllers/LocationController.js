const City = require('../models/City');  
const Region = require('../models/Region');  
  
exports.getCities = async (req, res) => {  
  try {  
    const cities = await City.find({ actif: true }).sort({ name: 1 });  
    res.json({ success: true, data: cities });  
  } catch (error) {  
    res.status(500).json({ success: false, error: error.message });  
  }  
};  
  
exports.createCity = async (req, res) => {  
  try {  
    const city = await City.create(req.body);  
    res.status(201).json({ success: true, data: city });  
  } catch (error) {  
    if (error.code === 11000) {  
      return res.status(400).json({ success: false, error: 'Cette ville existe déjà' });  
    }  
    res.status(400).json({ success: false, error: error.message });  
  }  
};  
  
exports.updateCity = async (req, res) => {  
  try {  
    const city = await City.findByIdAndUpdate(req.params.id, req.body, { new: true });  
    if (!city) {  
      return res.status(404).json({ success: false, error: 'Ville non trouvée' });  
    }  
    res.json({ success: true, data: city });  
  } catch (error) {  
    res.status(400).json({ success: false, error: error.message });  
  }  
};  
  
exports.deleteCity = async (req, res) => {  
  try {  
    const city = await City.findByIdAndUpdate(req.params.id, { actif: false }, { new: true });  
    if (!city) {  
      return res.status(404).json({ success: false, error: 'Ville non trouvée' });  
    }  
    res.json({ success: true, message: 'Ville supprimée' });  
  } catch (error) {  
    res.status(500).json({ success: false, error: error.message });  
  }  
};  
  
exports.getRegionsByCity = async (req, res) => {  
  try {  
    const { cityId } = req.params;  
    const regions = await Region.find({  
      city_id: cityId,  
      actif: true  
    }).sort({ nom: 1 });  
    res.json({ success: true, data: regions });  
  } catch (error) {  
    res.status(500).json({ success: false, error: error.message });  
  }  
};  
  
exports.createRegion = async (req, res) => {  
  try {  
    console.log('=== CRÉATION RÉGION ===');  
    console.log('Headers:', req.headers);  
    console.log('Body complet:', JSON.stringify(req.body, null, 2));  
    console.log('User:', req.user ? req.user._id : 'Non authentifié');  
      
    const { nom, code, city_id, description } = req.body;  
      
    console.log('Champs extraits:', { nom, code, city_id, description });  
      
    // Validation des champs requis  
    if (!nom || !code || !city_id) {  
      console.log('❌ Validation échouée:', { nom: !!nom, code: !!code, city_id: !!city_id });  
      return res.status(400).json({  
        success: false,  
        error: 'Les champs nom, code et city_id sont requis'  
      });  
    }  
      
    // Vérifier que la ville existe  
    console.log('Recherche de la ville:', city_id);  
    const city = await City.findById(city_id);  
    if (!city) {  
      console.log('❌ Ville non trouvée pour ID:', city_id);  
      return res.status(400).json({  
        success: false,  
        error: 'Ville non trouvée'  
      });  
    }  
    console.log('✅ Ville trouvée:', city.name);  
      
    console.log('Tentative de création avec:', req.body);  
    const region = await Region.create(req.body);  
    console.log('✅ Région créée:', region);  
      
    res.status(201).json({ success: true, data: region });  
  } catch (error) {  
    console.error('❌ Erreur complète:', error);  
    console.error('Stack trace:', error.stack);  
      
    if (error.code === 11000) {  
      console.log('Erreur de duplication:', error.keyValue);  
      return res.status(400).json({  
        success: false,  
        error: 'Une région avec ce code existe déjà'  
      });  
    }  
      
    res.status(400).json({ success: false, error: error.message });  
  }  
};
  
exports.updateRegion = async (req, res) => {  
  try {  
    const region = await Region.findByIdAndUpdate(req.params.id, req.body, { new: true });  
    if (!region) {  
      return res.status(404).json({ success: false, error: 'Région non trouvée' });  
    }  
    res.json({ success: true, data: region });  
  } catch (error) {  
    res.status(400).json({ success: false, error: error.message });  
  }  
};  
  
exports.deleteRegion = async (req, res) => {  
  try {  
    const region = await Region.findByIdAndUpdate(req.params.id, { actif: false }, { new: true });  
    if (!region) {  
      return res.status(404).json({ success: false, error: 'Région non trouvée' });  
    }  
    res.json({ success: true, message: 'Région supprimée' });  
  } catch (error) {  
    res.status(500).json({ success: false, error: error.message });  
  }  
};


exports.getAllRegions = async (req, res) => {  
  try {  
    const regions = await Region.find({ actif: true })  
      .populate('city_id', 'name code')  
      .sort({ nom: 1 });  
    res.json({ success: true, data: regions });  
  } catch (error) {  
    res.status(500).json({ success: false, error: error.message });  
  }  
};