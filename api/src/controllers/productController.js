const Product = require('../models/Product');

// Fonction pour transformer les données du backend vers le format frontend
const transformProductForFrontend = (product) => {
  const productObj = product.toObject ? product.toObject() : product;
  return {
    _id: productObj._id,
    code: productObj.reference,
    name: productObj.nom_court,
    category: productObj.type_gaz,
    capacity: productObj.capacite,
    price: productObj.prix_unitaire,
    weight: productObj.capacite, // Utiliser capacite comme poids par défaut
    description: productObj.nom_long || '',
    actif: productObj.actif,
    createdAt: productObj.createdAt,
    updatedAt: productObj.updatedAt
  };
};

// Récupérer tous les produits
exports.getAllProducts = async (req, res) => {
  try {
    const { actif, type_gaz, capacite } = req.query;
    
    // Construire le filtre
    let filter = {};
    if (actif !== undefined) filter.actif = actif === 'true';
    if (type_gaz) filter.type_gaz = type_gaz;
    if (capacite) filter.capacite = Number(capacite);

    const products = await Product.find(filter).sort({ nom_court: 1 });
    
    // Transformer les produits pour le frontend
    const transformedProducts = products.map(transformProductForFrontend);
    
    res.status(200).json({
      success: true,
      count: transformedProducts.length,
      data: transformedProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Récupérer un produit par ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produit non trouvé'
      });
    }
    
    res.status(200).json({
      success: true,
      data: transformProductForFrontend(product)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Créer un nouveau produit
exports.createProduct = async (req, res) => {
  try {
    // Mapper les champs du frontend vers le modèle backend
    const productData = {
      reference: req.body.code || req.body.reference,
      nom_court: req.body.name || req.body.nom_court,
      nom_long: req.body.description || req.body.nom_long,
      type_gaz: req.body.category || req.body.type_gaz,
      capacite: req.body.capacity || req.body.capacite,
      prix_unitaire: req.body.price || req.body.prix_unitaire,
      actif: req.body.actif !== undefined ? req.body.actif : true
    };
    
    const product = await Product.create(productData);
    
    // Transformer la réponse pour le frontend
    const responseData = transformProductForFrontend(product);
    
    res.status(201).json({
      success: true,
      data: responseData
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Un produit avec cette référence existe déjà'
      });
    }
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Mettre à jour un produit
exports.updateProduct = async (req, res) => {
  try {
    // Mapper les champs du frontend vers le modèle backend
    const updateData = {};
    if (req.body.code !== undefined) updateData.reference = req.body.code;
    if (req.body.name !== undefined) updateData.nom_court = req.body.name;
    if (req.body.description !== undefined) updateData.nom_long = req.body.description;
    if (req.body.category !== undefined) updateData.type_gaz = req.body.category;
    if (req.body.capacity !== undefined) updateData.capacite = req.body.capacity;
    if (req.body.price !== undefined) updateData.prix_unitaire = req.body.price;
    if (req.body.actif !== undefined) updateData.actif = req.body.actif;
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produit non trouvé'
      });
    }
    
    // Transformer la réponse pour le frontend
    const responseData = transformProductForFrontend(product);
    
    res.status(200).json({
      success: true,
      data: responseData
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Un produit avec cette référence existe déjà'
      });
    }
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Supprimer un produit (désactivation logique)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { actif: false },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Produit non trouvé'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Produit désactivé avec succès',
      data: transformProductForFrontend(product)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Rechercher des produits
exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Paramètre de recherche manquant'
      });
    }

    const products = await Product.find({
      $or: [
        { reference: { $regex: q, $options: 'i' } },
        { nom_court: { $regex: q, $options: 'i' } },
        { nom_long: { $regex: q, $options: 'i' } }
      ],
      actif: true
    }).limit(20);
    
    const transformedProducts = products.map(transformProductForFrontend);
    
    res.status(200).json({
      success: true,
      count: transformedProducts.length,
      data: transformedProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
