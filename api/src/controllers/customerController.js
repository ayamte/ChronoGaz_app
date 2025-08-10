const Customer = require('../models/Customer');
const PhysicalUser = require('../models/PhysicalUser');
const MoralUser = require('../models/MoralUser'); // à adapter selon ton nom réel
const UserAddress = require('../models/UserAddress');

// CORRECTION COMPLÈTE du contrôleur getClientAddresses

const getClientAddresses = async (req, res) => {
  try {
    const customerId = req.params.id;

    const customer = await Customer.findById(customerId).lean();

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Client non trouvé."
      });
    }

    let userInfo = {};
    let addresses = [];

    if (customer.type_client === 'PHYSIQUE' && customer.physical_user_id) {
      const physicalUser = await PhysicalUser.findById(customer.physical_user_id).lean();

      if (!physicalUser) {
        return res.status(404).json({ success: false, message: "Utilisateur physique non trouvé." });
      }

      userInfo = {
        type: 'PHYSIQUE',
        nom_complet: `${physicalUser.civilite} ${physicalUser.first_name} ${physicalUser.last_name}`,
        telephone: physicalUser.telephone || physicalUser.telephone_principal || '' // Gérer les deux cas
      };

      // Récupérer les adresses avec populate
      const userAddresses = await UserAddress.find({ physical_user_id: physicalUser._id })
        .populate('address_id')
        .lean();

      console.log("Adresses utilisateur trouvées:", userAddresses);

      // CORRECTION : Mapper les adresses correctement
      addresses = userAddresses.map(userAddr => {
        const addr = userAddr.address_id;
        
        return {
          _id: addr._id,
          type_adresse: userAddr.is_principal ? 'DOMICILE' : 'AUTRE', 
          num_appt: addr.num_appt || '',
          num_immeuble: addr.num_immeuble || '',
          rue: addr.rue || '',
          quartier: addr.quartier || '',
          ville: addr.ville || '',
          code_postal: addr.code_postal || '',
          region_id: addr.region_id || '',
          // CORRECTION : Le téléphone vient de physicalUser, pas de userAddr
          telephone: physicalUser.telephone || physicalUser.telephone_principal || '',
          instructions_livraison: addr.instructions_livraison || '',
          is_principal: userAddr.is_principal
        };
      });

    } else if (customer.type_client === 'MORAL' && customer.moral_user_id) {
      const moralUser = await MoralUser.findById(customer.moral_user_id).lean();

      if (!moralUser) {
        return res.status(404).json({ success: false, message: "Utilisateur moral non trouvé." });
      }

      userInfo = {
        type: 'MORAL',
        raison_sociale: moralUser.raison_sociale,
        telephone: moralUser.telephone || moralUser.telephone_principal || ''
      };

      // Pour les clients moraux - vérifier le bon champ de relation
      const userAddresses = await UserAddress.find({ 
        // ATTENTION : Vérifiez le nom exact du champ dans votre schéma UserAddress
        moral_user_id: moralUser._id  // ou physical_user_id si c'est unifié
      })
      .populate('address_id')
      .lean();

      console.log("Adresses utilisateur moral trouvées:", userAddresses);

      addresses = userAddresses.map(userAddr => {
        const addr = userAddr.address_id;
        
        return {
          _id: addr._id,
          type_adresse: userAddr.is_principal ? 'SIÈGE SOCIAL' : 'AUTRE',
          num_appt: addr.num_appt || '',
          num_immeuble: addr.num_immeuble || '',
          rue: addr.rue || '',
          quartier: addr.quartier || '',
          ville: addr.ville || '',
          code_postal: addr.code_postal || '',
          region_id: addr.region_id || '',
          // CORRECTION : Le téléphone vient de moralUser
          telephone: moralUser.telephone || moralUser.telephone_principal || '',
          instructions_livraison: addr.instructions_livraison || '',
          is_principal: userAddr.is_principal
        };
      });
      
    } else {
      return res.status(400).json({ success: false, message: "Client invalide ou type inconnu." });
    }

    console.log("Adresses formatées à retourner:", addresses);

    res.status(200).json({
      success: true,
      customer_code: customer.customer_code,
      user: userInfo,
      addresses: addresses // Retourner les adresses formatées
    });

  } catch (error) {
    console.error('Erreur getClientAddresses:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ALTERNATIVE : Si UserAddress n'a pas de champ moral_user_id séparé
// et que tous les utilisateurs (physiques et moraux) utilisent le même champ

const getClientAddressesAlternative = async (req, res) => {
  try {
    const customerId = req.params.id;

    const customer = await Customer.findById(customerId).lean();

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Client non trouvé."
      });
    }

    let userInfo = {};
    let addresses = [];
    let userId = null;
    let userTelephone = '';

    if (customer.type_client === 'PHYSIQUE' && customer.physical_user_id) {
      const physicalUser = await PhysicalUser.findById(customer.physical_user_id).lean();

      if (!physicalUser) {
        return res.status(404).json({ success: false, message: "Utilisateur physique non trouvé." });
      }

      userId = physicalUser._id;
      userTelephone = physicalUser.telephone || physicalUser.telephone_principal || '';
      
      userInfo = {
        type: 'PHYSIQUE',
        nom_complet: `${physicalUser.civilite} ${physicalUser.first_name} ${physicalUser.last_name}`,
        telephone: userTelephone
      };

    } else if (customer.type_client === 'MORAL' && customer.moral_user_id) {
      const moralUser = await MoralUser.findById(customer.moral_user_id).lean();

      if (!moralUser) {
        return res.status(404).json({ success: false, message: "Utilisateur moral non trouvé." });
      }

      userId = moralUser._id;
      userTelephone = moralUser.telephone || moralUser.telephone_principal || '';
      
      userInfo = {
        type: 'MORAL',
        raison_sociale: moralUser.raison_sociale,
        telephone: userTelephone
      };
    } else {
      return res.status(400).json({ success: false, message: "Client invalide ou type inconnu." });
    }

    // Récupérer les adresses pour cet utilisateur
    // ADAPTEZ le nom du champ selon votre schéma UserAddress
    const userAddresses = await UserAddress.find({ 
      $or: [
        { physical_user_id: userId },
        { moral_user_id: userId },
        { user_id: userId } // si vous avez un champ générique
      ]
    })
    .populate('address_id')
    .lean();

    console.log("Adresses utilisateur trouvées:", userAddresses);

    addresses = userAddresses.map(userAddr => {
      const addr = userAddr.address_id;
      
      return {
        _id: addr._id,
        type_adresse: userAddr.is_principal ? 
          (customer.type_client === 'PHYSIQUE' ? 'DOMICILE' : 'SIÈGE SOCIAL') : 
          'AUTRE',
        num_appt: addr.num_appt || '',
        num_immeuble: addr.num_immeuble || '',
        rue: addr.rue || '',
        quartier: addr.quartier || '',
        ville: addr.ville || '',
        code_postal: addr.code_postal || '',
        region_id: addr.region_id || '',
        telephone: userTelephone, // Utiliser le téléphone récupéré plus haut
        instructions_livraison: addr.instructions_livraison || '',
        is_principal: userAddr.is_principal
      };
    });

    console.log("Adresses formatées à retourner:", addresses);

    res.status(200).json({
      success: true,
      customer_code: customer.customer_code,
      user: userInfo,
      addresses: addresses
    });

  } catch (error) {
    console.error('Erreur getClientAddresses:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
  

const getCleintById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Ici on récupère l'adresse avec les détails de la région
      const customer = await Customer.findById(id);
  
      res.status(200).json({
        success: true,
        message: 'Client retrouve créée avec succès',
        data: customer
      });
    } catch (err) {
      console.error('Erreur lors de recuperation de client:', err);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la recherche de client',
        error: err.message,
        details: err.errors
      });
      
    }
  }
  
  module.exports = {
    getClientAddresses,
    getCleintById
  }