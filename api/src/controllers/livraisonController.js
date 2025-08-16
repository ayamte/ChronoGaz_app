const Livraison = require('../models/Livraison');    
const LivraisonLine = require('../models/LivraisonLine');    
const Planification = require('../models/Planification');    
const Command = require('../models/Commande');    
const CommandeLine = require('../models/CommandeLine');    
const mongoose = require('mongoose');    
    
// Démarrer une livraison depuis une planification    
const startLivraison = async (req, res) => {    
  try {    
    const { planificationId } = req.params;    
    const { latitude, longitude, details } = req.body;    
    
    const planification = await Planification.findById(planificationId)    
      .populate('commande_id')    
      .populate('trucks_id')    
      .populate('livreur_employee_id');    
    
    if (!planification) {    
      return res.status(404).json({    
        success: false,    
        message: 'Planification non trouvée'    
      });    
    }    
    
    // Vérifier qu'il n'y a pas déjà une livraison    
    const livraisonExistante = await Livraison.findOne({ planification_id: planificationId });    
    if (livraisonExistante) {    
      return res.status(400).json({    
        success: false,    
        message: 'Une livraison existe déjà pour cette planification'    
      });    
    }    
    
    // Créer la livraison    
    const nouvelleLivraison = new Livraison({    
      planification_id: planificationId,    
      date: new Date(),    
      livreur_employee_id: planification.livreur_employee_id._id,    
      trucks_id: planification.trucks_id._id,    
      etat: 'EN_COURS',    
      latitude,    
      longitude,    
      details,    
      total: planification.commande_id.montant_total,    
      total_ttc: planification.commande_id.montant_total,    
      total_tva: 0    
    });    
    
    await nouvelleLivraison.save();    
    
    // Mettre à jour l'état de la planification    
    planification.etat = 'EN_COURS';    
    await planification.save();    
    
    // Copier les lignes de commande vers les lignes de livraison    
    const lignesCommande = await CommandeLine.find({     
      commande_id: planification.commande_id._id     
    });    
    
    const lignesLivraison = lignesCommande.map(ligne => ({    
      livraison_id: nouvelleLivraison._id,    
      quantity: ligne.quantity,    
      price: ligne.price,    
      product_id: ligne.product_id,    
      UM_id: ligne.UM_id,    
      total_ligne: ligne.quantity * ligne.price    
    }));    
    
    await LivraisonLine.insertMany(lignesLivraison);    
    
    res.status(201).json({    
      success: true,    
      message: 'Livraison démarrée avec succès',    
      data: nouvelleLivraison    
    });    
    
  } catch (error) {    
    console.error('Erreur lors du démarrage de la livraison:', error);    
    res.status(500).json({    
      success: false,    
      message: error.message    
    });    
  }    
};    
    
// Terminer une livraison    
const completeLivraison = async (req, res) => {    
  try {    
    const { id } = req.params;    
    const {     
      etat,     
      latitude,     
      longitude,  
      details,    
      signature_client,    
      photo_livraison,    
      commentaires_livreur,    
      commentaires_client,    
      evaluation_client    
    } = req.body;    
    
    if (!mongoose.Types.ObjectId.isValid(id)) {    
      return res.status(400).json({    
        success: false,    
        message: 'ID de livraison invalide'    
      });    
    }    
    
    const livraison = await Livraison.findById(id)    
      .populate('planification_id');    
    
    if (!livraison) {    
      return res.status(404).json({    
        success: false,    
        message: 'Livraison non trouvée'    
      });    
    }    
    
    if (livraison.etat !== 'EN_COURS') {    
      return res.status(400).json({    
        success: false,    
        message: 'La livraison doit être en cours pour être terminée'    
      });    
    }    
    
    // Mettre à jour la livraison    
    const updateData = {    
      etat: etat || 'LIVRE',    
      latitude: latitude || livraison.latitude,    
      longitude: longitude || livraison.longitude,    
      details: details || livraison.details,    
      signature_client: signature_client || livraison.signature_client,    
      photo_livraison: photo_livraison || livraison.photo_livraison,    
      commentaires_livreur: commentaires_livreur || livraison.commentaires_livreur,    
      commentaires_client: commentaires_client || livraison.commentaires_client,    
      evaluation_client: evaluation_client || livraison.evaluation_client    
    };    
    
    const livraisonMiseAJour = await Livraison.findByIdAndUpdate(    
      id,     
      updateData,     
      { new: true }    
    );    
    
    // Mettre à jour l'état de la planification    
    const planification = await Planification.findById(livraison.planification_id._id);    
    if (planification) {    
      planification.etat = etat || 'LIVRE';    
      await planification.save();    
    }    
    
    res.status(200).json({    
      success: true,    
      message: 'Livraison terminée avec succès',    
      data: livraisonMiseAJour    
    });    
    
  } catch (error) {    
    console.error('Erreur lors de la finalisation de la livraison:', error);    
    res.status(500).json({    
      success: false,    
      message: error.message    
    });    
  }    
};    
    
// Obtenir toutes les livraisons    
const getLivraisons = async (req, res) => {    
  try {    
    const { page = 1, limit = 20, etat, planificationId, livreur_employee_id } = req.query;    
    const skip = (parseInt(page) - 1) * parseInt(limit);    
        
    const filter = {};    
    if (etat && etat !== 'all') {      
      filter.etat = etat.toUpperCase();      
    }      
    if (planificationId) {      
      filter.planification_id = planificationId;      
    }    
    if (livreur_employee_id) {   
      filter.livreur_employee_id = livreur_employee_id;      
    }   
    
    const livraisons = await Livraison.find(filter)    
      .populate({    
        path: 'planification_id',    
        populate: [    
          {    
            path: 'commande_id',    
            select: 'numero_commande date_commande montant_total details',    
            populate: [    
              {    
                path: 'customer_id',    
                select: 'customer_code type_client physical_user_id',    
                populate: {    
                  path: 'physical_user_id',    
                  select: 'first_name last_name telephone_principal'    
                }    
              },    
              {    
                path: 'address_id',    
                select: 'street latitude longitude type_adresse',    
                populate: {    
                  path: 'city_id',    
                  select: 'name code'    
                }    
              }    
            ]    
          },    
          {    
            path: 'trucks_id',    
            select: 'matricule marque'    
          },    
          {    
            path: 'livreur_employee_id',    
            select: 'matricule fonction physical_user_id',    
            populate: {    
              path: 'physical_user_id',    
              select: 'first_name last_name'    
            }    
          }    
        ]    
      })    
      .sort({ date: -1 })    
      .skip(skip)    
      .limit(parseInt(limit));  
  
    // Récupérer les lignes pour chaque livraison  
    for (let livraison of livraisons) {    
      if (livraison.planification_id?.commande_id?._id) {    
        const lignes = await CommandeLine.find({     
          commande_id: livraison.planification_id.commande_id._id     
        })    
        .populate('product_id', 'ref long_name short_name brand')    
        .populate('UM_id', 'unitemesure');    
            
        livraison.planification_id.commande_id.lignes = lignes;    
      }    
    }  
    
    const count = await Livraison.countDocuments(filter);    
    
    res.status(200).json({    
      success: true,    
      count,    
      data: livraisons,    
      pagination: {    
        current_page: parseInt(page),    
        total_pages: Math.ceil(count / parseInt(limit)),    
        total_items: count,    
        items_per_page: parseInt(limit)    
      }    
    });    
    
  } catch (error) {    
    console.error('Erreur lors de la récupération des livraisons:', error);    
    res.status(500).json({    
      success: false,    
      message: error.message    
    });    
  }    
};    
    
// Obtenir une livraison par ID    
const getLivraisonById = async (req, res) => {    
  try {    
    const { id } = req.params;    
    
    if (!mongoose.Types.ObjectId.isValid(id)) {    
      return res.status(400).json({    
        success: false,    
        message: 'ID de livraison invalide'    
      });    
    }    
    
    const livraison = await Livraison.findById(id)    
      .populate({    
        path: 'planification_id',    
        populate: [    
          {    
            path: 'commande_id',    
            populate: {    
              path: 'customer_id',    
              select: 'customer_code type_client'    
            }    
          },    
          {    
            path: 'trucks_id',    
            select: 'matricule marque capacite'    
          },    
          {    
            path: 'livreur_employee_id',    
            select: 'matricule fonction physical_user_id',    
            populate: {    
              path: 'physical_user_id',    
              select: 'first_name last_name telephone_principal'    
            }    
          }    
        ]    
      });    
    
    if (!livraison) {    
      return res.status(404).json({    
        success: false,    
        message: 'Livraison non trouvée'    
      });    
    }    
    
    // Récupérer les lignes de livraison    
    const lignesLivraison = await LivraisonLine.find({ livraison_id: id })    
      .populate('product_id', 'ref long_name short_name brand')    
      .populate('UM_id', 'unitemesure');    
    
    res.status(200).json({    
      success: true,    
      data: {    
        livraison,    
        lignes: lignesLivraison    
      }    
    });    
    
  } catch (error) {    
    console.error('Erreur lors de la récupération de la livraison:', error);    
    res.status(500).json({    
      success: false,    
      message: error.message    
    });    
  }    
};    
    
// Mettre à jour les lignes de livraison    
const updateLivraisonLines = async (req, res) => {    
  try {    
    const { id } = req.params;    
    const { lignes } = req.body;    
    
    if (!mongoose.Types.ObjectId.isValid(id)) {    
      return res.status(400).json({    
        success: false,    
        message: 'ID de livraison invalide'    
      });    
    }    
    
    const livraison = await Livraison.findById(id);    
    if (!livraison) {    
      return res.status(404).json({    
        success: false,    
        message: 'Livraison non trouvée'    
      });    
    }    
    
    // Supprimer les anciennes lignes    
    await LivraisonLine.deleteMany({ livraison_id: id });    
    
    // Créer les nouvelles lignes    
    const nouvellesLignes = lignes.map(ligne => ({    
      livraison_id: id,    
      quantity: ligne.quantity,    
      price: ligne.price,    
      product_id: ligne.product_id,    
      UM_id: ligne.UM_id,    
      total_ligne: ligne.quantity * ligne.price,    
      etat_ligne: ligne.etat_ligne || 'LIVRE'    
    }));    
    
    await LivraisonLine.insertMany(nouvellesLignes);    
    
    // Recalculer le total de la livraison    
    const nouveauTotal = nouvellesLignes.reduce((total, ligne) => total + ligne.total_ligne, 0);    
    livraison.total = nouveauTotal;    
    livraison.total_ttc = nouveauTotal;    
    await livraison.save();    
    
    res.status(200).json({    
      success: true,    
      message: 'Lignes de livraison mises à jour avec succès',    
      data: { livraison, lignes: nouvellesLignes }    
    });    
    
  } catch (error) {    
    console.error('Erreur lors de la mise à jour des lignes:', error);    
    res.status(500).json({    
      success: false,    
      message: error.message    
    });    
  }    
};    
    
module.exports = {    
  startLivraison,    
  completeLivraison,    
  getLivraisons,    
  getLivraisonById,    
  updateLivraisonLines    
};