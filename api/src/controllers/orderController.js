const Command = require('../models/Commande');
const CommandeLine = require('../models/CommandeLine');
const Planification = require('../models/Planification');
const Statut = require('../models/StatutCommande');
const mongoose = require('mongoose');



const getCommands = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search, priority, dateFrom, dateTo } = req.query;
    
    // Définir le filtre de base
    const filter = {};
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // 1. Gérer le filtre de statut
    if (status && status !== 'all') {
      const statutFilter = await Statut.findOne({ code: status.toUpperCase() });
      if (statutFilter) {
        filter.statut_id = statutFilter._id;
      }
    }
    
    // 2. Gérer la recherche (si nécessaire)
    if (search) {
      filter.$or = [
        { numero_commande: { $regex: search, $options: 'i' } },
        // Vous pouvez ajouter d'autres champs ici pour la recherche
      ];
    }
    
    // 3. Gérer les filtres de date (si nécessaire)
    if (dateFrom || dateTo) {
      filter.date_commande = {};
      if (dateFrom) {
        filter.date_commande.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filter.date_commande.$lte = new Date(dateTo);
      }
    }
    
    // 4. Gérer le filtre de priorité (si nécessaire)
    if (priority && priority !== 'all') {
      filter.urgent = (priority === 'urgent');
    }

    // Récupérer les commandes avec les filtres, le tri et la pagination
    const commandes = await Command.find(filter)
      .populate({
          path: 'customer_id',
          select: 'customer_code type_client physical_user_id',
          populate: {
            path: 'physical_user_id',
            select: 'first_name last_name telephone_principal'
          }
      })
      .populate('address_livraison_id', 'rue ville')
      .populate('statut_id', 'code nom') 
      .sort({ date_commande: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    // Récupérer le nombre total de documents pour la pagination
    const count = await Command.countDocuments(filter);

    const commandesComplete = await Promise.all(
      commandes.map(async (commande) => {
        const planification = await Planification.findOne({ commande_id: commande._id })
          .populate('truck_id', 'matricule marque')
          .populate({
              path: 'livreur_id',
              select: 'matricule fonction physical_user_id',
              populate: {
                path: 'physical_user_id',
                select: 'first_name last_name'
              }
            });

        return {
          ...commande.toObject(),
          planification
        };
      })
    );

    res.status(200).json({
      success: true,
      count: count,
      data: commandesComplete
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
  const getCommandById = async (req, res) => {
    try{
      const { id } = req.params;
      const command = await Command.findById(id)
      .populate({
        path: 'customer_id',
        select: 'customer_code type_client physical_user_id',
        populate: {
          path: 'physical_user_id',
          select: 'first_name last_name telephone_principal'
        }
    })
        .populate('address_livraison_id')
        .populate('statut_id');
      
      if(!command){
        return res.status(404).json({
          success: false,
          message: 'commande non trouvée'
        });
      }

      // Récupérer les lignes de commande
      const lignesCommande = await CommandeLine.find({commande_id: id})
        .populate('product_id', 'reference nom_long prix_unitaire')
        .populate('um_id', 'code nom');

      // Récupérer la planification si elle existe
      const planification = await Planification.findOne({ commande_id: id })
        .populate('truck_id', 'matricule marque')
        .populate('livreur_id', 'matricule fonction')
        .populate('accompagnateur_id', 'matricule matricule');

      res.status(200).json({
        success: true,
        data: {
          command,
          lignes: lignesCommande,
          planification
        }
      });
    } catch(error){
      console.error('Erreur lors de la récupération de la commande:', error);
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  };

  // Récupérer toutes les commandes d'un client spécifique
const getCommandsByCustomerId = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { page = 1, limit = 10, status, sortBy = 'date_commande', sortOrder = 'desc' } = req.query;

    // Vérifier que l'ID client est valide
    if (!customerId || !customerId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'ID client invalide'
      });
    }

    // Construire le filtre de base
    const filter = { customer_id: customerId };
    
    // Ajouter le filtre de statut si spécifié
    if (status) {
      const statutFilter = await Statut.findOne({ code: status.toUpperCase() });
      if (statutFilter) {
        filter.statut_id = statutFilter._id;
      }
    }

    // Options de pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Récupérer les commandes avec pagination
    const commandes = await Command.find(filter)
      .populate('customer_id', 'customer_code type_client nom_commercial')
      .populate('address_livraison_id', 'rue ville code_postal')
      .populate('statut_id', 'code nom couleur')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Récupérer le nombre total pour la pagination
    const totalCommandes = await Command.countDocuments(filter);

    // Pour chaque commande, récupérer les lignes et la planification
    const commandesComplete = await Promise.all(
      commandes.map(async (commande) => {
        // Récupérer les lignes de commande
        const lignesCommande = await CommandeLine.find({ commande_id: commande._id })
          .populate('product_id', 'reference nom_long prix_unitaire')
          .populate('um_id', 'code nom');

        // Récupérer la planification si elle existe
        const planification = await Planification.findOne({ commande_id: commande._id })
          .populate('truck_id', 'matricule marque')
          .populate({
            path: 'livreur_id',
            select: 'matricule fonction physical_user_id',
            populate: {
              path: 'physical_user_id',
              select: 'first_name last_name telephone_principal'
            }
          })
          .populate('accompagnateur_id', 'matricule nom prenom');

        return {
          ...commande.toObject(),
          lignes: lignesCommande,
          planification
        };
      })
    );

    // Calculer les informations de pagination
    const totalPages = Math.ceil(totalCommandes / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.status(200).json({
      success: true,
      data: {
        commandes: commandesComplete,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCommandes,
          hasNextPage,
          hasPrevPage,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des commandes du client:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
  // Récupérer les statistiques des commandes
const getCommandsStats = async (req, res) => {
  try {
    const stats = await Command.aggregate([
      {
        $group: {
          _id: '$statut_id',
          count: { $sum: 1 },
          totalAmount: { $sum: '$total_ttc' }
        }
      },
      {
        $lookup: {
          from: 'statutcommandes',
          localField: '_id',
          foreignField: '_id',
          as: 'statut'
        }
      }
    ]);

    const totalCommandes = await Command.countDocuments();
    const commandesUrgentes = await Command.countDocuments({ urgent: true });
    const totalCA = await Command.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$total_ttc' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCommandes,
        commandesUrgentes,
        chiffreAffaires: totalCA[0]?.total || 0,
        repartitionParStatut: stats
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


// Récupérer les statistiques des commandes pour un client spécifique
const getCommandsStatsByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    // Vérifier que l'ID client est valide
    if (!customerId || !customerId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'ID client invalide'
      });
    }

    // Statistiques par statut pour ce client
    const statsByStatus = await Command.aggregate([
      {
        $match: { customer_id: new mongoose.Types.ObjectId(customerId) }
      },
      {
        $group: {
          _id: '$statut_id',
          count: { $sum: 1 },
          totalAmount: { $sum: '$total_ttc' }
        }
      },
      {
        $lookup: {
          from: 'statutcommandes',
          localField: '_id',
          foreignField: '_id',
          as: 'statut'
        }
      },
      {
        $unwind: '$statut'
      },
      {
        $project: {
          _id: 1,
          count: 1,
          totalAmount: 1,
          statut: {
            code: '$statut.code',
            nom: '$statut.nom'
          }
        }
      }
    ]);

    // Nombre total de commandes pour ce client
    const totalCommandes = await Command.countDocuments({ customer_id: customerId });

    // Commandes urgentes pour ce client
    const commandesUrgentes = await Command.countDocuments({ 
      customer_id: customerId, 
      urgent: true 
    });

    // Chiffre d'affaires total pour ce client
    const totalCA = await Command.aggregate([
      {
        $match: { customer_id: new mongoose.Types.ObjectId(customerId) }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total_ttc' }
        }
      }
    ]);

    // Évolution mensuelle des commandes (12 derniers mois)
    const evolutionMensuelle = await Command.aggregate([
      {
        $match: { 
          customer_id: new mongoose.Types.ObjectId(customerId),
          date_commande: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date_commande' },
            month: { $month: '$date_commande' }
          },
          nombreCommandes: { $sum: 1 },
          chiffreAffaires: { $sum: '$total_ttc' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      },
      {
        $project: {
          _id: 0,
          periode: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              { 
                $cond: {
                  if: { $lt: ['$_id.month', 10] },
                  then: { $concat: ['0', { $toString: '$_id.month' }] },
                  else: { $toString: '$_id.month' }
                }
              }
            ]
          },
          nombreCommandes: 1,
          chiffreAffaires: 1
        }
      }
    ]);

    // Commande la plus récente
    const derniere_commande = await Command.findOne({ customer_id: customerId })
      .sort({ date_commande: -1 })
      .populate('statut_id', 'code nom')
      .select('numero_commande date_commande total_ttc statut_id');

    // Panier moyen
    const panierMoyen = totalCommandes > 0 ? (totalCA[0]?.total || 0) / totalCommandes : 0;

    // Informations du client
    const customerInfo = await Command.findOne({ customer_id: customerId })
      .populate('customer_id', 'customer_code type_client nom_commercial')
      .select('customer_id');

    res.status(200).json({
      success: true,
      data: {
        client: customerInfo?.customer_id || null,
        totalCommandes,
        commandesUrgentes,
        chiffreAffaires: totalCA[0]?.total || 0,
        panierMoyen: Math.round(panierMoyen * 100) / 100, // Arrondi à 2 décimales
        repartitionParStatut: statsByStatus,
        evolutionMensuelle,
        derniereCommande: derniere_commande
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques client:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};


  // Créer une nouvelle commande
const createCommand = async (req, res) => {
  try {
    const {
      numero_commande,
      customer_id,
      address_livraison_id,
      date_commande,
      date_souhaite,
      statut_id,
      urgent,
      total_ht,
      total_tva,
      total_ttc,
      commentaires,
      lignes // Array des lignes de commande
    } = req.body;

    // Validation des champs obligatoires
    if (!numero_commande || !customer_id || !address_livraison_id || !statut_id) {
      return res.status(400).json({
        success: false,
        message: 'Les champs numero_commande, customer_id, address_livraison_id et statut_id sont obligatoires'
      });
    }

    // Créer la commande
    const nouvelleCommande = new Command({
      numero_commande,
      customer_id: new mongoose.Types.ObjectId(customer_id),
      address_livraison_id: new mongoose.Types.ObjectId(address_livraison_id),
      statut_id: new mongoose.Types.ObjectId(statut_id),
      date_commande: date_commande || new Date(),
      date_souhaite,
      urgent: urgent || false,
      commentaires,
      total_ht: total_ht || 0,
      total_tva: total_tva || 0,
      total_ttc: total_ttc || 0
    });


    const commandeSauvegardee = await nouvelleCommande.save();

    // Si des lignes de commande sont fournies, les créer
    if (lignes && Array.isArray(lignes) && lignes.length > 0) {
      const lignesCommande = lignes.map(ligne => ({
        commande_id: commandeSauvegardee._id,
        product_id: ligne.product_id,
        um_id: ligne.um_id,
        quantite: ligne.quantite,
        prix_unitaire: ligne.prix_unitaire,
        total_ligne: ligne.total_ligne || (ligne.quantite * ligne.prix_unitaire),
        //remarques: ligne.remarques
      }));

      await CommandeLine.insertMany(lignesCommande);
    }

    // Récupérer la commande créée avec ses relations
    const commandeComplete = await Command.findById(commandeSauvegardee._id)
      .populate('customer_id', 'customer_code type_client')
      .populate('address_livraison_id', 'rue ville')
      .populate('statut_id', 'code nom');

    res.status(201).json({
      success: true,
      message: 'Commande créée avec succès',
      data: commandeComplete
    });

  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    
    // Gestion des erreurs de validation Mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors
      });
    }

    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Supprimer une commande et ses lignes associées
const deleteCommandById = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que l'ID est valide
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'ID de commande invalide'
      });
    }

    // Vérifier si la commande existe
    const commande = await Command.findById(id);
    if (!commande) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    // Optionnel: Vérifier si la commande peut être supprimée
    // (par exemple, ne pas supprimer les commandes déjà livrées)
    const commandePopulee = await Command.findById(id).populate('statut_id');
    if (commandePopulee.statut_id && commandePopulee.statut_id.code === 'LIVREE') {
      return res.status(400).json({
        success: false,
        message: 'Impossible de supprimer une commande déjà livrée'
      });
    }

    // Supprimer les lignes de commande associées en premier
    const lignesSupprimees = await CommandeLine.deleteMany({ commande_id: id });
    
    // Supprimer la planification si elle existe
    const planificationSupprimee = await Planification.deleteOne({ commande_id: id });
    
    // Supprimer la commande
    await Command.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Commande supprimée avec succès',
      data: {
        commandeSupprimee: true,
        lignesSupprimees: lignesSupprimees.deletedCount,
        planificationSupprimee: planificationSupprimee.deletedCount > 0
      }
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de la commande:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Mettre à jour une commande
const updateCommandById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      customer_id,
      address_livraison_id,
      statut_id,
      date_commande,
      date_souhaite,
      urgent,
      commentaires,
      total_ht,
      total_tva,
      total_ttc,
      lignes, // lignes de commande
    } = req.body;
    let truck_id, livreur_id, accompagnateur_id, date_planifiee;

    if (req.body.planification) {
      ({
        truck_id,
        livreur_id,
        accompagnateur_id,
        date_planifiee
      } = req.body.planification);
    }

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'ID de commande invalide'
      });
    }

    const commandeExistante = await Command.findById(id);
    if (!commandeExistante) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    const updateData = {};
    if (customer_id !== undefined) updateData.customer_id = customer_id;
    if (address_livraison_id !== undefined) updateData.address_livraison_id = address_livraison_id;
    if (statut_id !== undefined) updateData.statut_id = statut_id;
    if (date_commande !== undefined) updateData.date_commande = date_commande;
    if (date_souhaite !== undefined) updateData.date_souhaite = date_souhaite;
    if (urgent !== undefined) updateData.urgent = urgent;
    if (commentaires !== undefined) updateData.commentaires = commentaires;
    if (total_ht !== undefined) updateData.total_ht = total_ht;
    if (total_tva !== undefined) updateData.total_tva = total_tva;
    if (total_ttc !== undefined) updateData.total_ttc = total_ttc;

    // Mettre à jour la commande
    const commandeMiseAJour = await Command.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    // Gérer les lignes de commande
    if (lignes && Array.isArray(lignes)) {
      await CommandeLine.deleteMany({ commande_id: id });

      if (lignes.length > 0) {
        const nouvellesLignes = lignes.map(ligne => ({
          commande_id: id,
          product_id: ligne.product_id,
          um_id: ligne.um_id,
          quantite: ligne.quantite,
          prix_unitaire: ligne.prix_unitaire,
          prix_total: ligne.prix_total || (ligne.quantite * ligne.prix_unitaire),
          total_ligne: ligne.total_ligne || (ligne.quantite * ligne.prix_unitaire),
          remarques: ligne.remarques
        }));

        await CommandeLine.insertMany(nouvellesLignes);
      }
    }

    // Si le statut est CONFIRMEE → créer planification + passer en PLANIFIEE
    if (statut_id) {
      const nouveauStatut = await Statut.findById(statut_id);
      if (nouveauStatut && nouveauStatut.code === 'CONFIRMEE') {

        // Vérifie que les données pour la planification sont bien là
        if (!truck_id || !livreur_id || !accompagnateur_id || !date_planifiee) {
          return res.status(400).json({
            success: false,
            message: 'truck_id, livreur_id, accompagnateur_id et date_planifiee sont requis pour la planification'
          });
        }

        // Évite une double planification (si déjà existante)
        const planifExistante = await Planification.findOne({ commande_id: id });
        if (!planifExistante) {
          await new Planification({
            commande_id: id,
            truck_id,
            livreur_id,
            accompagnateur_id,
            date_planifiee
          }).save();
        }

        // Récupérer le statut PLANIFIEE
        const statutPlanifiee = await Statut.findOne({ code: 'PLANIFIEE' });
        if (!statutPlanifiee) {
          return res.status(500).json({
            success: false,
            message: 'Le statut "PLANIFIEE" est introuvable'
          });
        }

        // Mise à jour du statut en PLANIFIEE
        await Command.findByIdAndUpdate(id, { statut_id: statutPlanifiee._id });
      }
    }

    const commandeComplete = await Command.findById(id)
      .populate('customer_id', 'customer_code type_client')
      .populate('address_livraison_id', 'rue ville')
      .populate('statut_id', 'code nom');

    res.status(200).json({
      success: true,
      message: 'Commande mise à jour avec succès',
      data: commandeComplete
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la commande:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// Mettre à jour seulement le statut d'une commande
const updateCommandStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut_id, truck_id, livreur_id, accompagnateur_id, date_planifiee } = req.body;

    if (!statut_id) {
      return res.status(400).json({
        success: false,
        message: 'Le champ statut_id est obligatoire'
      });
    }

    const nouveauStatut = await Statut.findById(statut_id);
    if (!nouveauStatut) {
      return res.status(404).json({
        success: false,
        message: 'Statut demandé introuvable'
      });
    }

    // Si le statut est "CONFIRMEE", on crée la planification directement
    if (nouveauStatut.code === 'CONFIRMEE') {

      // Vérifier que les champs nécessaires à la planification sont fournis
      if (!truck_id || !livreur_id || !date_planifiee) {
        return res.status(400).json({
          success: false,
          message: 'truck_id, livreur_id, accompagnateur_id et date_planifiee sont requis pour planifier la commande'
        });
      }

      // Créer la planification
      const nouvellePlanification = new Planification({
        commande_id: id,
        truck_id,
        livreur_id,
        accompagnateur_id: accompagnateur_id || null,
        date_planifiee
      });
      await nouvellePlanification.save();

      // Récupérer le statut "PLANIFIEE"
      const statutPlanifiee = await Statut.findOne({ code: 'PLANIFIEE' });
      if (!statutPlanifiee) {
        return res.status(500).json({
          success: false,
          message: 'Le statut "PLANIFIEE" est introuvable dans la base'
        });
      }

      // Mettre à jour la commande avec le statut PLANIFIEE
      const commandeMiseAJour = await Command.findByIdAndUpdate(
        id,
        { statut_id: statutPlanifiee._id },
        { new: true, runValidators: true }
      ).populate('statut_id', 'code nom');

      return res.status(200).json({
        success: true,
        message: 'Commande planifiée avec succès',
        data: {
          commande: commandeMiseAJour,
          planification: nouvellePlanification
        }
      });
    }

    // Sinon : simple mise à jour du statut
    const commandeMiseAJour = await Command.findByIdAndUpdate(
      id,
      { statut_id },
      { new: true, runValidators: true }
    ).populate('statut_id', 'code nom');

    if (!commandeMiseAJour) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Statut de la commande mis à jour',
      data: commandeMiseAJour
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const commande = await Command.findById(id).populate('statut_id');
    if (!commande) {
      return res.status(404).json({ success: false, message: "Commande non trouvée" });
    }

    // On vérifie si le statut permet l'annulation
    const statutActuel = commande.statut_id?.code;
    const statutNonAnnulables = ['CONFIRMEE', 'PLANIFIEE', 'EN_COURS', 'LIVREE'];

    if (statutNonAnnulables.includes(statutActuel)) {
      return res.status(400).json({
        success: false,
        message: `Impossible d'annuler une commande avec le statut "${statutActuel}"`
      });
    }

    // Trouver le statut "ANNULEE"
    const statutAnnulee = await Statut.findOne({ code: 'ANNULEE' });
    if (!statutAnnulee) {
      return res.status(500).json({
        success: false,
        message: 'Le statut "ANNULEE" est introuvable dans la base'
      });
    }

    // Mettre à jour la commande
    commande.statut_id = statutAnnulee._id;
    await commande.save();

    res.status(200).json({
      success: true,
      message: 'Commande annulée avec succès',
      data: commande
    });

  } catch (error) {
    console.error('Erreur lors de l\'annulation de la commande:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
  
  module.exports = {
    getCommands, 
    getCommandById,
    getCommandsStats,
    getCommandsByCustomerId,
    getCommandsStatsByCustomer,
    createCommand,
    deleteCommandById,
    updateCommandById,
    updateCommandStatus,
    cancelOrder
  };