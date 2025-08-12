const mongoose = require('mongoose');    
const Customer = require('../models/Customer');    
const PhysicalUser = require('../models/PhysicalUser');    
const MoralUser = require('../models/MoralUser');    
const UserAddress = require('../models/UserAddress');    
    
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
      // Population des références ObjectId pour PhysicalUser    
      const physicalUser = await PhysicalUser.findById(customer.physical_user_id)    
        .populate('region_principale', 'nom code')    
        .populate('city_id', 'name code')    
        .lean();    
    
      if (!physicalUser) {    
        return res.status(404).json({ success: false, message: "Utilisateur physique non trouvé." });    
      }    
    
      userInfo = {    
        type: 'PHYSIQUE',    
        nom_complet: `${physicalUser.civilite} ${physicalUser.first_name} ${physicalUser.last_name}`,    
        telephone: physicalUser.telephone || physicalUser.telephone_principal || '',    
        city: physicalUser.city_id,    
        region: physicalUser.region_principale    
      };    
    
      // Récupérer les adresses avec populate complet    
      const userAddresses = await UserAddress.find({ physical_user_id: physicalUser._id })    
        .populate({    
          path: 'address_id',    
          populate: [  
            {    
              path: 'region_id',    
              select: 'nom code'    
            },  
            {  
              path: 'city_id',  
              select: 'name code'  
            }  
          ]  
        })    
        .lean();    
    
      console.log("Adresses utilisateur trouvées:", userAddresses);    
    
      // Mapper les adresses selon le nouveau modèle Address  
      addresses = userAddresses.map(userAddr => {    
        const addr = userAddr.address_id;    
            
        return {    
          _id: addr._id,    
          type_adresse: userAddr.is_principal ? 'DOMICILE' : 'AUTRE',     
          numappt: addr.numappt || '',  // ✅ Utiliser numappt du modèle  
          numimmeuble: addr.numimmeuble || '',  // ✅ Utiliser numimmeuble du modèle  
          street: addr.street || '',  // ✅ Utiliser street du modèle  
          city: addr.city_id, // ✅ Référence ObjectId populée  
          postal_code: addr.postal_code || '',  // ✅ Utiliser postal_code du modèle  
          region: addr.region_id, // ✅ Référence ObjectId populée  
          telephone: physicalUser.telephone || physicalUser.telephone_principal || '',    
          latitude: addr.latitude,  
          longitude: addr.longitude,  
          is_principal: userAddr.is_principal    
        };    
      });    
    
    } else if (customer.type_client === 'MORAL' && customer.moral_user_id) {    
      // Population des références ObjectId pour MoralUser    
      const moralUser = await MoralUser.findById(customer.moral_user_id)    
        .populate('region_principale', 'nom code')    
        .populate('city_id', 'name code')    
        .lean();    
    
      if (!moralUser) {    
        return res.status(404).json({ success: false, message: "Utilisateur moral non trouvé." });    
      }    
    
      userInfo = {    
        type: 'MORAL',    
        raison_sociale: moralUser.raison_sociale,    
        telephone: moralUser.telephone || moralUser.telephone_principal || '',    
        city: moralUser.city_id,    
        region: moralUser.region_principale    
      };    
    
      // Pour les clients moraux    
      const userAddresses = await UserAddress.find({     
        moral_user_id: moralUser._id    
      })    
      .populate({    
        path: 'address_id',    
        populate: [  
          {    
            path: 'region_id',    
            select: 'nom code'    
          },  
          {  
            path: 'city_id',  
            select: 'name code'  
          }  
        ]  
      })    
      .lean();    
    
      console.log("Adresses utilisateur moral trouvées:", userAddresses);    
    
      addresses = userAddresses.map(userAddr => {    
        const addr = userAddr.address_id;    
            
        return {    
          _id: addr._id,    
          type_adresse: userAddr.is_principal ? 'SIÈGE SOCIAL' : 'AUTRE',    
          numappt: addr.numappt || '',    
          numimmeuble: addr.numimmeuble || '',    
          street: addr.street || '',    
          city: addr.city_id, // ✅ Référence ObjectId populée  
          postal_code: addr.postal_code || '',    
          region: addr.region_id, // ✅ Référence ObjectId populée  
          telephone: moralUser.telephone || moralUser.telephone_principal || '',    
          latitude: addr.latitude,  
          longitude: addr.longitude,  
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
      addresses: addresses    
    });    
    
  } catch (error) {    
    console.error('Erreur getClientAddresses:', error);    
    res.status(500).json({ success: false, message: error.message });    
  }    
};    
    
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
      const physicalUser = await PhysicalUser.findById(customer.physical_user_id)    
        .populate('region_principale', 'nom code')    
        .populate('city_id', 'name code')    
        .lean();    
    
      if (!physicalUser) {    
        return res.status(404).json({ success: false, message: "Utilisateur physique non trouvé." });    
      }    
    
      userId = physicalUser._id;    
      userTelephone = physicalUser.telephone || physicalUser.telephone_principal || '';    
          
      userInfo = {    
        type: 'PHYSIQUE',    
        nom_complet: `${physicalUser.civilite} ${physicalUser.first_name} ${physicalUser.last_name}`,    
        telephone: userTelephone,    
        city: physicalUser.city_id,    
        region: physicalUser.region_principale    
      };    
    
    } else if (customer.type_client === 'MORAL' && customer.moral_user_id) {    
      const moralUser = await MoralUser.findById(customer.moral_user_id)    
        .populate('region_principale', 'nom code')    
        .populate('city_id', 'name code')    
        .lean();    
    
      if (!moralUser) {    
        return res.status(404).json({ success: false, message: "Utilisateur moral non trouvé." });    
      }    
    
      userId = moralUser._id;    
      userTelephone = moralUser.telephone || moralUser.telephone_principal || '';    
          
      userInfo = {    
        type: 'MORAL',    
        raison_sociale: moralUser.raison_sociale,    
        telephone: userTelephone,    
        city: moralUser.city_id,    
        region: moralUser.region_principale    
      };    
    } else {    
      return res.status(400).json({ success: false, message: "Client invalide ou type inconnu." });    
    }    
    
    // Récupérer les adresses pour cet utilisateur    
    const userAddresses = await UserAddress.find({     
      $or: [    
        { physical_user_id: userId },    
        { moral_user_id: userId },    
        { user_id: userId }    
      ]    
    })    
    .populate({    
      path: 'address_id',    
      populate: [  
        {    
          path: 'region_id',    
          select: 'nom code'    
        },  
        {  
          path: 'city_id',  
          select: 'name code'  
        }  
      ]  
    })    
    .lean();    
    
    console.log("Adresses utilisateur trouvées:", userAddresses);    
    
    addresses = userAddresses.map(userAddr => {    
      const addr = userAddr.address_id;    
          
      return {    
        _id: addr._id,    
        type_adresse: userAddr.is_principal ?     
          (customer.type_client === 'PHYSIQUE' ? 'DOMICILE' : 'SIÈGE SOCIAL') :     
          'AUTRE',    
        numappt: addr.numappt || '',    
        numimmeuble: addr.numimmeuble || '',    
        street: addr.street || '',    
        city: addr.city_id, // ✅ Référence ObjectId populée  
        postal_code: addr.postal_code || '',    
        region: addr.region_id, // ✅ Référence ObjectId populée  
        telephone: userTelephone,    
        latitude: addr.latitude,  
        longitude: addr.longitude,  
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
    
const getClientById = async (req, res) => {    
  try {    
    const { id } = req.params;    
    
    // Population complète du client avec les nouvelles références    
    const customer = await Customer.findById(id)    
      .populate({    
        path: 'physical_user_id',    
        populate: [    
          {    
            path: 'region_principale',    
            select: 'nom code'    
          },    
          {    
            path: 'city_id',    
            select: 'name code'    
          }    
        ]    
      })    
      .populate({    
        path: 'moral_user_id',    
        populate: [    
          {    
            path: 'region_principale',    
            select: 'nom code'    
          },    
          {    
            path: 'city_id',    
            select: 'name code'    
          }    
        ]    
      });    
    
    if (!customer) {    
      return res.status(404).json({    
        success: false,    
        message: 'Client non trouvé'    
      });    
    }    
    
    res.status(200).json({    
      success: true,    
      message: 'Client récupéré avec succès',    
      data: customer    
    });    
  } catch (err) {    
    console.error('Erreur lors de récupération de client:', err);    
    res.status(500).json({    
      success: false,    
      message: 'Erreur serveur lors de la recherche de client',    
      error: err.message    
    });    
  }    
};    
    
module.exports = {    
  getClientAddresses,    
  getClientAddressesAlternative,    
  getClientById    
};