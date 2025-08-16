const Planification = require('../models/Planification');  
const CommandeLine = require('../models/CommandeLine');  
const mongoose = require('mongoose');  
  
// Obtenir toutes les planifications avec filtres  
const getPlanifications = async (req, res) => {  
  try {  
    const { page = 1, limit = 20, etat, livreur_employee_id, trucks_id, dateFrom, dateTo, priority } = req.query;  
    const skip = (parseInt(page) - 1) * parseInt(limit);  
      
    const filter = {};  
    if (etat && etat !== 'all') {  
      filter.etat = etat.toUpperCase();  
    }  
    if (livreur_employee_id) {  
      filter.livreur_employee_id = livreur_employee_id;  
    }  
    if (trucks_id) {  
      filter.trucks_id = trucks_id;  
    }  
    if (priority && priority !== 'all') {  
      filter.priority = priority;  
    }  
    if (dateFrom || dateTo) {  
      filter.delivery_date = {};  
      if (dateFrom) {  
        filter.delivery_date.$gte = new Date(dateFrom);  
      }  
      if (dateTo) {  
        filter.delivery_date.$lte = new Date(dateTo);  
      }  
    }  
  
    const planifications = await Planification.find(filter)  
      .populate({  
        path: 'commande_id',  
        populate: [  
          {  
            path: 'customer_id',  
            populate: [  
              { path: 'physical_user_id' },  
              { path: 'moral_user_id' }  
            ]  
          },  
          {  
            path: 'address_id',  
            populate: { path: 'city_id' }  
          }  
        ]  
      })  
      .populate('trucks_id')  
      .populate({  
        path: 'livreur_employee_id',  
        populate: { path: 'physical_user_id' }  
      })  
      .populate({  
        path: 'accompagnateur_id',  
        populate: { path: 'physical_user_id' }  
      })  
      .sort({ delivery_date: 1 })  
      .skip(skip)  
      .limit(parseInt(limit));  
  
    // Enrichir avec les lignes de commande  
    const planificationsComplete = await Promise.all(  
      planifications.map(async (planification) => {  
        const lignes = await CommandeLine.find({   
          commande_id: planification.commande_id._id   
        })  
        .populate('product_id', 'ref long_name short_name brand prix')  
        .populate('UM_id', 'unitemesure');  
  
        return {  
          ...planification.toObject(),  
          lignes  
        };  
      })  
    );  
  
    const count = await Planification.countDocuments(filter);  
  
    res.status(200).json({  
      success: true,  
      count,  
      data: planificationsComplete,  
      pagination: {  
        current_page: parseInt(page),  
        total_pages: Math.ceil(count / parseInt(limit)),  
        total_items: count,  
        items_per_page: parseInt(limit)  
      }  
    });  
  
  } catch (error) {  
    console.error('Erreur récupération planifications:', error);  
    res.status(500).json({  
      success: false,  
      message: error.message  
    });  
  }  
};  
  
// Obtenir une planification par ID  
const getPlanificationById = async (req, res) => {  
  try {  
    const { id } = req.params;  
      
    if (!mongoose.Types.ObjectId.isValid(id)) {  
      return res.status(400).json({  
        success: false,  
        message: 'ID de planification invalide'  
      });  
    }  
  
    const planification = await Planification.findById(id)  
      .populate({  
        path: 'commande_id',  
        populate: [  
          { path: 'customer_id', populate: [{ path: 'physical_user_id' }, { path: 'moral_user_id' }] },  
          { path: 'address_id', populate: { path: 'city_id' } }  
        ]  
      })  
      .populate('trucks_id')  
      .populate({ path: 'livreur_employee_id', populate: { path: 'physical_user_id' } })  
      .populate({ path: 'accompagnateur_id', populate: { path: 'physical_user_id' } });  
  
    if (!planification) {  
      return res.status(404).json({  
        success: false,  
        message: 'Planification non trouvée'  
      });  
    }  
  
    // Récupérer les lignes de commande  
    const lignes = await CommandeLine.find({   
      commande_id: planification.commande_id._id   
    })  
    .populate('product_id', 'ref long_name short_name brand prix')  
    .populate('UM_id', 'unitemesure');  
  
    res.status(200).json({  
      success: true,  
      data: {  
        ...planification.toObject(),  
        lignes  
      }  
    });  
  
  } catch (error) {  
    console.error('Erreur récupération planification:', error);  
    res.status(500).json({  
      success: false,  
      message: error.message  
    });  
  }  
};  
  
module.exports = {  
  getPlanifications,  
  getPlanificationById  
};