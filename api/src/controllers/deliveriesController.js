// controllers/deliveriesController.js
const Planification = require('../models/Planification');
const Livraison = require('../models/Livraison');
const Command = require('../models/Commande');
const Statut = require('../models/StatutCommande');
const UserAddress = require('../models/UserAddress');
const Address = require('../models/Address');
const Employe = require('../models/Employe');

const {updateDriverPosition, getLastDriverPosition } = require('../utils/gpsTracker');

// Obtenir toutes les livraisons
const getDeliveries = async (req, res) => {
  try {
    const livraisons = await Livraison.find({})
      .populate({
        path: 'planification_id',
        populate: [
          {
            path: 'commande_id',
            populate: [
              { path: 'customer_id', select: 'customer_code type_client' },
              { path: 'address_livraison_id', select: 'rue ville latitude longitude' },
              { path: 'statut_id', select: 'code nom' }
            ]
          },
          { path: 'truck_id', select: 'matricule marque' },
          {
            path: 'livreur_id',
            populate: {
              path: 'physical_user_id',
              select: 'first_name last_name telephone_principal'
            },
            select: 'matricule fonction physical_user_id'
          },
          {
            path: 'accompagnateur_id',
            populate: {
              path: 'physical_user_id',
              select: 'first_name last_name telephone_principal'
            },
            select: 'matricule fonction physical_user_id'
          }
        ]
      })
      .sort({ date_livraison: -1 });

    res.status(200).json({
      success: true,
      count: livraisons.length,
      data: livraisons
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des livraisons:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Obtenir les livraisons d'aujourd'hui
const getTodayDeliveries = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const livraisonsAujourdhui = await Livraison.find({
      date_livraison: {
        $gte: today,
        $lt: tomorrow
      }
    })
    .populate({
      path: 'planification_id',
      populate: [
        {
          path: 'commande_id',
          populate: [
            { path: 'customer_id', select: 'customer_code type_client' },
            { path: 'address_livraison_id', select: 'rue ville latitude longitude' },
            { path: 'statut_id', select: 'code nom' }
          ]
        },
        { path: 'truck_id', select: 'matricule marque' },
        {
          path: 'livreur_id',
          populate: {
            path: 'physical_user_id',
            select: 'first_name last_name telephone_principal'
          },
          select: 'matricule fonction physical_user_id'
        },
        {
          path: 'accompagnateur_id',
          populate: {
            path: 'physical_user_id',
            select: 'first_name last_name telephone_principal'
          },
          select: 'matricule fonction physical_user_id'
        }
      ]
    })
    .sort({ date_livraison: -1 });

    res.status(200).json({
      success: true,
      count: livraisonsAujourdhui.length,
      data: livraisonsAujourdhui
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des livraisons du jour:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Obtenir les planifications d'aujourd'hui (pour créer des livraisons)
const getTodayPlanifications = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const planifications = await Planification.find({
      date_planifiee: {
        $gte: today,
        $lt: tomorrow
      }
    })
    .populate({
      path: 'commande_id',
      populate: [
        { path: 'customer_id', select: 'customer_code type_client' },
        { path: 'address_livraison_id', select: 'rue ville latitude longitude' },
        { path: 'statut_id', select: 'code nom' }
      ]
    })
    .populate('truck_id', 'matricule marque')
    .populate({
      path: 'livreur_id',
      populate: {
        path: 'physical_user_id',
        select: 'first_name last_name telephone_principal'
      },
      select: 'matricule fonction physical_user_id'
    })
    .populate({
      path: 'accompagnateur_id',
      populate: {
        path: 'physical_user_id',
        select: 'first_name last_name telephone_principal'
      },
      select: 'matricule fonction physical_user_id'
    });

    // Vérifier quelles planifications ont déjà des livraisons
    const planificationsAvecStatut = await Promise.all(
      planifications.map(async (planification) => {
        const livraison = await Livraison.findOne({ planification_id: planification._id });
        return {
          ...planification.toObject(),
          livraison_statut: livraison ? livraison.statut : 'NON_DEMARREE'
        };
      })
    );

    res.status(200).json({
      success: true,
      count: planificationsAvecStatut.length,
      data: planificationsAvecStatut
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des planifications du jour:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Obtenir une livraison spécifique
const getDeliveryById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validation de l'ID
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
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
            populate: [
              { path: 'customer_id', select: 'customer_code type_client' },
              { path: 'address_livraison_id', select: 'rue ville latitude longitude' },
              { path: 'statut_id', select: 'code nom' }
            ]
          },
          { path: 'truck_id', select: 'matricule marque' },
          {
            path: 'livreur_id',
            populate: {
              path: 'physical_user_id',
              select: 'first_name last_name telephone_principal'
            },
            select: 'matricule fonction physical_user_id'
          },
          {
            path: 'accompagnateur_id',
            populate: {
              path: 'physical_user_id',
              select: 'first_name last_name telephone_principal'
            },
            select: 'matricule fonction physical_user_id'
          }
        ]
      });

    if (!livraison) {
      return res.status(404).json({
        success: false,
        message: 'Livraison non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      data: livraison
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la livraison:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Obtenir une livraison par ID de planification
const getDeliveryByPlanificationId = async (req, res) => {
  try {
    const { planificationId } = req.params;

    // Validation de l'ID
    if (!planificationId || !planificationId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'ID de planification invalide'
      });
    }
    
    const livraison = await Livraison.findOne({ planification_id: planificationId })
      .populate({
        path: 'planification_id',
        populate: [
          {
            path: 'commande_id',
            populate: [
              { path: 'customer_id', select: 'customer_code type_client' },
              { path: 'address_livraison_id', select: 'rue ville latitude longitude' },
              { path: 'statut_id', select: 'code nom' }
            ]
          },
          { path: 'truck_id', select: 'matricule marque' },
          {
            path: 'livreur_id',
            populate: {
              path: 'physical_user_id',
              select: 'first_name last_name telephone_principal'
            },
            select: 'matricule fonction physical_user_id'
          }
        ]
      });

    if (!livraison) {
      return res.status(404).json({
        success: false,
        message: 'Aucune livraison trouvée pour cette planification'
      });
    }

    res.status(200).json({
      success: true,
      data: livraison
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la livraison:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Démarrer une livraison (créer une nouvelle livraison)
const startDelivery = async (req, res) => {
  try {
    const { planificationId } = req.params;
    const { latitude, longitude, commentaires_livreur } = req.body;

    // Validation de l'ID
    if (!planificationId || !planificationId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'ID de planification invalide'
      });
    }

    // Vérifier que la planification existe
    const planification = await Planification.findById(planificationId);
    if (!planification) {
      return res.status(404).json({
        success: false,
        message: 'Planification non trouvée'
      });
    }

    // Vérifier qu'il n'y a pas déjà une livraison en cours
    const livraisonExistante = await Livraison.findOne({ 
      planification_id: planificationId,
      statut: { $in: ['EN_COURS'] }
    });

    if (livraisonExistante) {
      return res.status(400).json({
        success: false,
        message: 'Une livraison est déjà en cours pour cette planification'
      });
    }

    // Récupérer le statut EN_COURS pour la commande
    const statutEnCours = await Statut.findOne({ code: 'EN_COURS' });
    if (!statutEnCours) {
      return res.status(500).json({
        success: false,
        message: 'Statut EN_COURS non trouvé dans la base'
      });
    }

    // Créer la nouvelle livraison
    const nouvelleLivraison = new Livraison({
      planification_id: planificationId,
      date_livraison: new Date(),
      statut: 'EN_COURS',
      latitude_livraison: latitude ? parseFloat(latitude) : null,
      longitude_livraison: longitude ? parseFloat(longitude) : null,
      commentaires_livreur: commentaires_livreur || null
    });

    const livraisonSauvegardee = await nouvelleLivraison.save();

    // Mettre à jour le statut de la commande
    await Command.findByIdAndUpdate(planification.commande_id, {
      statut_id: statutEnCours._id
    });

    // Enregistrer la position de départ si fournie
    if (latitude && longitude) {
      await enregistrerPositionGPS(planification.livreur_id, latitude, longitude, 'Position de départ - Livraison démarrée');
    }

    // Récupérer la livraison complète avec les relations
    const livraisonComplete = await Livraison.findById(livraisonSauvegardee._id)
      .populate({
        path: 'planification_id',
        populate: [
          { path: 'commande_id' },
          {
            path: 'livreur_id',
            populate: {
              path: 'physical_user_id',
              select: 'matricule fonction date_embauche'
            }
          }
        ]
      });

    res.status(201).json({
      success: true,
      message: 'Livraison démarrée avec succès',
      data: livraisonComplete
    });
  } catch (error) {
    console.error('Erreur lors du démarrage de la livraison:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Mettre à jour la position GPS d'une livraison
/*const updateDeliveryPosition = async (req, res) => {
  try {
    const { id } = req.params;
    const { latitude, longitude } = req.body;

    // Validation des paramètres
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'ID de livraison invalide'
      });
    }

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude et longitude sont requises'
      });
    }

    // Validation des coordonnées
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({
        success: false,
        message: 'Coordonnées GPS invalides'
      });
    }

    const livraison = await Livraison.findById(id).populate({
      path:'planification_id',
      populate: {
        path: 'livreur_id',
        populate: {
          path: 'physical_user_id'
        }
      }
    });
    if (!livraison) {
      return res.status(404).json({
        success: false,
        message: 'Livraison non trouvée'
      });
    }

    if (livraison.statut !== 'EN_COURS') {
      return res.status(400).json({
        success: false,
        message: 'La livraison doit être en cours pour mettre à jour la position'
      });
    }

    const livreurId = livraison.planification_id.livreur_id.physical_user_id;
    //console.log('livreurId:', livreurId);


    // trouver l'adresse du livreur
    const userAddress = await UserAddress.findOne({
      physical_user_id: livreurId,
      is_principal: false
    }).populate('address_id');
    //console.log('userAddress:', userAddress);


    if(!userAddress || !userAddress.address_id){
      return res.status(404).json({ success: false, message: 'adresse non trouve'});
    }

    // Mettre à jour les coordonnées GPS de l’adresse du livreur
    const address = userAddress.address_id;
    address.latitude = lat;
    address.longitude = lng;
    await address.save();

    // Enregistrer la position GPS dans l'historique
    await enregistrerPositionGPS(
      livreurId, 
      lat, 
      lng, 
      `Position GPS - ${new Date().toLocaleTimeString()}`
    );

    res.status(200).json({
      success: true,
      message: 'Position mise à jour avec succès',
      data: {
        latitude: lat,
        longitude: lng,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de position:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};*/

// Terminer une livraison
const completeDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      latitude, 
      longitude, 
      commentaires_livreur, 
      commentaires_client,
      evaluation_client,
      signature_client,
      photo_livraison,
      statut = 'LIVREE' // LIVREE, ECHEC, PARTIELLE
    } = req.body;

    // Validation de l'ID
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'ID de livraison invalide'
      });
    }

    // Validation du statut
    if (!['LIVREE', 'ECHEC', 'PARTIELLE'].includes(statut)) {
      return res.status(400).json({
        success: false,
        message: 'Statut de livraison invalide'
      });
    }

    const livraison = await Livraison.findById(id).populate('planification_id');
    if (!livraison) {
      return res.status(404).json({
        success: false,
        message: 'Livraison non trouvée'
      });
    }

    if (livraison.statut !== 'EN_COURS') {
      return res.status(400).json({
        success: false,
        message: 'La livraison doit être en cours pour être terminée'
      });
    }

    // Construire les données de mise à jour (sans modifier la latitude_livraison !)
    const updateData = {
      statut: statut,
      commentaires_livreur: commentaires_livreur || livraison.commentaires_livreur,
      commentaires_client: commentaires_client || livraison.commentaires_client,
      evaluation_client: evaluation_client || livraison.evaluation_client,
      signature_client: signature_client || livraison.signature_client,
      photo_livraison: photo_livraison || livraison.photo_livraison
    };

    const livraisonMiseAJour = await Livraison.findByIdAndUpdate(id, updateData, { new: true });

    // Mettre à jour le statut de la commande liée
    let codeStatutCommande;
    switch (statut) {
      case 'LIVREE':    codeStatutCommande = 'LIVREE'; break;
      case 'ECHEC':     codeStatutCommande = 'ECHEC_LIVRAISON'; break;
      case 'PARTIELLE': codeStatutCommande = 'LIVRAISON_PARTIELLE'; break;
      default:          codeStatutCommande = 'LIVREE';
    }

    const nouveauStatut = await Statut.findOne({ code: codeStatutCommande });
    if (nouveauStatut) {
      await Command.findByIdAndUpdate(
        livraison.planification_id.commande_id, 
        { statut_id: nouveauStatut._id }
      );
    }

    // Enregistrer la position finale du livreur
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);

      if (!isNaN(lat) && !isNaN(lng)) {
        // Historique
        await enregistrerPositionGPS(
          livraison.planification_id.livreur_id,
          lat,
          lng,
          `Position finale - Livraison ${statut.toLowerCase()}`
        );

        // Mettre à jour l'adresse actuelle du livreur
        const userAddress = await UserAddress.findOne({
          physical_user_id: livraison.planification_id.livreur_id,
          is_principal: false
        }).populate('address_id');

        if (userAddress?.address_id) {
          userAddress.address_id.latitude = lat;
          userAddress.address_id.longitude = lng;
          await userAddress.address_id.save();
        }
      }
    }

    // Recharger la livraison complète avec toutes les relations
    const livraisonComplete = await Livraison.findById(id)
      .populate({
        path: 'planification_id',
        populate: [
          { path: 'commande_id' },
          {
            path: 'livreur_id',
            populate: {
              path: 'physical_user_id',
              select: 'matricule fonction date_embauche'
            }
          }
        ]
      });

    res.status(200).json({
      success: true,
      message: 'Livraison terminée avec succès',
      data: livraisonComplete
    });

  } catch (error) {
    console.error('Erreur lors de la finalisation de la livraison:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Obtenir les données de suivi GPS
const getDeliveryTracking = async (req, res) => {
  try {
    const { id } = req.params;

    // Validation de l'ID
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
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
            populate: [
              { path: 'address_livraison_id', select: 'rue ville latitude longitude' },
              { path: 'customer_id', select: 'customer_code type_client' },
              { path: 'statut_id', select: 'code nom' }
            ]
          },
          {
            path: 'livreur_id',
            populate: {
              path: 'physical_user_id',
              select: 'first_name last_name'
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

    // Récupérer les positions GPS du livreur depuis user_address
    let positionsGPS = [];
    if (livraison.planification_id.livreur_id && livraison.planification_id.livreur_id.physical_user_id) {
      const userAddresses = await UserAddress.find({
        physical_user_id: livraison.planification_id.livreur_id.physical_user_id._id,
        is_principal: false // Les positions GPS ne sont pas principales
      })
      .populate({
        path: 'address_id',
        match: { type_adresse: 'TRAVAIL' },
        select: 'rue ville latitude longitude createdAt'
      })
      .sort({ createdAt: -1 })
      .limit(20); // Limiter aux 20 dernières positions

      positionsGPS = userAddresses
        .filter(ua => ua.address_id) // Filtrer les adresses nulles
        .map(ua => ({
          latitude: ua.address_id.latitude,
          longitude: ua.address_id.longitude,
          timestamp: ua.createdAt,
          description: ua.address_id.rue
        }));
    }

    const trackingData = {
      livraison_id: livraison._id,
      planification_id: livraison.planification_id._id,
      statut_livraison: livraison.statut,
      statut_commande: livraison.planification_id.commande_id.statut_id,
      destination: livraison.planification_id.commande_id.address_livraison_id,
      client: livraison.planification_id.commande_id.customer_id,
      livreur: livraison.planification_id.livreur_id,
      date_planifiee: livraison.planification_id.date_planifiee,
      date_livraison: livraison.date_livraison,
      position_livraison: {
        latitude: livraison.latitude_livraison,
        longitude: livraison.longitude_livraison
      },
      positions_gps: positionsGPS,
      derniere_position: positionsGPS.length > 0 ? positionsGPS[0] : null
    };

    res.status(200).json({
      success: true,
      data: trackingData
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du suivi:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Obtenir les statistiques des livraisons
const getDeliveriesStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Statistiques du jour basées sur les livraisons
    const statsJour = await Livraison.aggregate([
      {
        $match: {
          date_livraison: { $gte: today, $lt: tomorrow }
        }
      },
      {
        $group: {
          _id: '$statut',
          count: { $sum: 1 }
        }
      }
    ]);

    // Transformer les résultats
    const statsFormatees = {
      total: 0,
      en_cours: 0,
      livrees: 0,
      echecs: 0,
      partielles: 0
    };

    statsJour.forEach(stat => {
      statsFormatees.total += stat.count;
      switch (stat._id) {
        case 'EN_COURS':
          statsFormatees.en_cours = stat.count;
          break;
        case 'LIVREE':
          statsFormatees.livrees = stat.count;
          break;
        case 'ECHEC':
          statsFormatees.echecs = stat.count;
          break;
        case 'PARTIELLE':
          statsFormatees.partielles = stat.count;
          break;
      }
    });

    // Compter les planifications sans livraison (en attente)
    const planificationsSansLivraison = await Planification.countDocuments({
      date_planifiee: { $gte: today, $lt: tomorrow },
      _id: { 
        $nin: await Livraison.distinct('planification_id', {
          date_livraison: { $gte: today, $lt: tomorrow }
        })
      }
    });

    // Statistiques générales
    const totalLivraisons = await Livraison.countDocuments();
    const totalLivreurs = await Employe.countDocuments({ fonction: 'CHAUFFEUR', actif: true });

    // Taux de réussite
    const tauxReussite = statsFormatees.total > 0 
      ? Math.round((statsFormatees.livrees / statsFormatees.total) * 100) 
      : 0;

    res.status(200).json({
      success: true,
      data: {
        aujourd_hui: {
          ...statsFormatees,
          en_attente: planificationsSansLivraison,
          taux_reussite: tauxReussite
        },
        general: {
          total_livraisons: totalLivraisons,
          livreurs_actifs: totalLivreurs
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Fonction utilitaire pour enregistrer les positions GPS
const enregistrerPositionGPS = async (livreurId, latitude, longitude, description) => {
  try {
    // Récupérer l'employé livreur pour obtenir son physical_user_id
    const livreur = await Employe.findById(livreurId).populate('physical_user_id');
    
    if (livreur && livreur.physical_user_id) {
      // Créer une adresse pour la position
      const position = new Address({
        rue: description,
        ville: 'En transit',
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        type_adresse: 'LIVRAISON'
      });
      
      const positionSauvegardee = await position.save();
      
      // Créer la liaison user_address
      const userAddress = new UserAddress({
        physical_user_id: livreur.physical_user_id._id,
        address_id: positionSauvegardee._id,
        is_principal: false
      });
      
      await userAddress.save();
    }
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la position GPS:', error);
    // Ne pas faire échouer la requête principale si l'enregistrement GPS échoue
  }
};

// Mettre à jour la position GPS d'une livraison (MODIFIÉE)
const updateDeliveryPosition = async (req, res) => {
  try {
    const { id } = req.params;
    const { latitude, longitude } = req.body;

    // Validation des paramètres
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'ID de livraison invalide'
      });
    }

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude et longitude sont requises'
      });
    }

    // Validation des coordonnées
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({
        success: false,
        message: 'Coordonnées GPS invalides'
      });
    }

    const livraison = await Livraison.findById(id);
    if (!livraison) {
      return res.status(404).json({
        success: false,
        message: 'Livraison non trouvée'
      });
    }

    if (livraison.statut !== 'EN_COURS') {
      return res.status(400).json({
        success: false,
        message: 'La livraison doit être en cours pour mettre à jour la position'
      });
    }

    // Utiliser la fonction utilitaire qui gère WebSocket
    const result = await updateDriverPosition(id, lat, lng, req.io);

    res.status(200).json({
      success: true,
      message: 'Position mise à jour avec succès',
      data: {
        ...result.position,
        timestamp: new Date()
      }
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de position:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Nouvelle route pour obtenir la position en temps réel
const getRealTimePosition = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'ID de livraison invalide'
      });
    }

    const position = await getLastDriverPosition(id);

    if (!position) {
      return res.status(404).json({
        success: false,
        message: 'Position non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      data: position
    });

  } catch (error) {
    console.error('Erreur récupération position temps réel:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  getDeliveries,
  getTodayDeliveries,
  getTodayPlanifications,
  getDeliveryById,
  getDeliveryByPlanificationId,
  startDelivery,
  updateDeliveryPosition,
  completeDelivery,
  getDeliveryTracking,
  getDeliveriesStats,
  getRealTimePosition
};