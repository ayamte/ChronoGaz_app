const User = require('../models/User');  
const PhysicalUser = require('../models/PhysicalUser');  
const MoralUser = require('../models/MoralUser');  
const Customer = require('../models/Customer');  
const Employe = require('../models/Employe');  
  
const getProfile = async (req, res) => {  
  try {  
    const userId = req.user._id;  
    const user = req.user; 
      
    let profileData = {  
      id: user._id,  
      email: user.email,  
      role: user.role_id.code, 
      last_login: user.last_login  
    };  
  
    // Récupérer les données spécifiques selon le type d'utilisateur  
    const physicalUser = await PhysicalUser.findOne({ user_id: userId });  
    if (physicalUser) {  
      profileData.profile = {  
        type: 'PHYSIQUE',  
        email: user.email,
        first_name: physicalUser.first_name,  
        last_name: physicalUser.last_name,  
        civilite: physicalUser.civilite,  
        cin: physicalUser.cin,  
        telephone_principal: physicalUser.telephone_principal,  
        adresse_principale: physicalUser.adresse_principale,  
        ville: physicalUser.ville,  
        region_principale: physicalUser.region_principale,  
        date_naissance: physicalUser.date_naissance  
      };  
        
      // Si c'est un client, récupérer les infos client  
      if (user.role_id.code === 'CLIENT') {  
        const customer = await Customer.findOne({ physical_user_id: physicalUser._id });  
        if (customer) {  
          profileData.customer_info = {  
            customer_code: customer.customer_code,  
            type_client: customer.type_client,  
            credit_limite: customer.credit_limite,  
            credit_utilise: customer.credit_utilise,  
            date_inscription: customer.date_inscription  
          };  
        }  
      }  
        
      // Si c'est un employé, récupérer les infos employé  
      if (user.role_id.code === 'EMPLOYE') {  
        const employe = await Employe.findOne({ physical_user_id: physicalUser._id });  
        if (employe) {  
          profileData.employee_info = {  
            matricule: employe.matricule,  
            fonction: employe.fonction,  
            date_embauche: employe.date_embauche,  
            cnss: employe.cnss,  
            salaire_base: employe.salaire_base  
          };  
        }  
      }  
    }  
      
    // Vérifier s'il s'agit d'une personne morale  
    const moralUser = await MoralUser.findOne({ user_id: userId });  
    if (moralUser) {  
      profileData.profile = {  
        type: 'MORAL',  
        email: user.email,
        raison_sociale: moralUser.raison_sociale,  
        ice: moralUser.ice,  
        patente: moralUser.patente,  
        rc: moralUser.rc,  
        ville_rc: moralUser.ville_rc,  
        forme_juridique: moralUser.forme_juridique,  
        secteur_activite: moralUser.secteur_activite,  
        telephone_principal: moralUser.telephone_principal,  
        adresse_principale: moralUser.adresse_principale,  
        ville: moralUser.ville,  
        region_principale: moralUser.region_principale  
      };  
        
      // Si c'est un client moral, récupérer les infos client  
      if (user.role_id.code === 'CLIENT') {  
        const customer = await Customer.findOne({ moral_user_id: moralUser._id });  
        if (customer) {  
          profileData.customer_info = {  
            customer_code: customer.customer_code,  
            type_client: customer.type_client,  
            credit_limite: customer.credit_limite,  
            credit_utilise: customer.credit_utilise,  
            date_inscription: customer.date_inscription  
          };  
        }  
      }  
    }  
  
    res.json({  
      success: true,  
      data: profileData  
    });  
  } catch (error) {  
    console.error('Erreur lors de la récupération du profil:', error);  
    res.status(500).json({  
      success: false,  
      message: 'Erreur interne du serveur',  
      error: error.message  
    });  
  }  
};  
  
const updateProfile = async (req, res) => {  
  try {  
    const userId = req.user._id;  
    const user = req.user;  
    const { profile, customer_info } = req.body;  
  
    // Validation des régions autorisées  
    const regionsAutorisees = ['2 Mars', 'Maarif', 'Bir Anzarane', 'Boulevard al qods'];  

       let updatedData = {};  
      
    if (profile?.region_principale && !regionsAutorisees.includes(profile.region_principale)) {  
      return res.status(400).json({  
        success: false,  
        message: `Région invalide. Les régions autorisées sont : ${regionsAutorisees.join(', ')}`  
      });  
    }  
  if (profile?.email && profile.email !== user.email) {  
  await User.findByIdAndUpdate(userId, { email: profile.email });  
  updatedData.email = profile.email;  
}
 
  
    // Mettre à jour selon le type d'utilisateur  
    const physicalUser = await PhysicalUser.findOne({ user_id: userId });  
    if (physicalUser && profile) {  
      // Validation pour personne physique  
      const allowedFields = [  
        'first_name', 'last_name', 'civilite',   
        'telephone_principal', 'adresse_principale',   
        'ville', 'region_principale', 'date_naissance'  
      ];  
        
      const updateFields = {};  
      allowedFields.forEach(field => {  
        if (profile[field] !== undefined) {  
          updateFields[field] = profile[field];  
        }  
      });  
  
      const updatedPhysicalUser = await PhysicalUser.findOneAndUpdate(  
        { user_id: userId },  
        updateFields,  
        { new: true, runValidators: true }  
      );  
  
      updatedData.profile = {  
        type: 'PHYSIQUE',  
        ...updatedPhysicalUser.toObject()  
      };  
  
      // Mettre à jour les infos client si applicable  
      if (user.role_id.code === 'CLIENT' && customer_info) {  
        const customer = await Customer.findOne({ physical_user_id: physicalUser._id });  
        if (customer) {  
          const customerUpdateFields = {};  
          if (customer_info.credit_limite !== undefined) {  
            customerUpdateFields.credit_limite = customer_info.credit_limite;  
          }  
            
          if (Object.keys(customerUpdateFields).length > 0) {  
            const updatedCustomer = await Customer.findOneAndUpdate(  
              { physical_user_id: physicalUser._id },  
              customerUpdateFields,  
              { new: true }  
            );  
            updatedData.customer_info = updatedCustomer;  
          }  
        }  
      }  
    }  
  
    // Gérer les utilisateurs moraux  
    const moralUser = await MoralUser.findOne({ user_id: userId });  
    if (moralUser && profile) {  
      const allowedFields = [  
        'raison_sociale', 'ice', 'patente', 'rc', 'ville_rc',  
        'forme_juridique', 'secteur_activite', 'telephone_principal',  
        'adresse_principale', 'ville', 'region_principale'  
      ];  
        
      const updateFields = {};  
      allowedFields.forEach(field => {  
        if (profile[field] !== undefined) {  
          updateFields[field] = profile[field];  
        }  
      });  
  
      const updatedMoralUser = await MoralUser.findOneAndUpdate(  
        { user_id: userId },  
        updateFields,  
        { new: true, runValidators: true }  
      );  
  
      updatedData.profile = {  
        type: 'MORAL',  
        ...updatedMoralUser.toObject()  
      };  
  
      // Mettre à jour les infos client moral si applicable  
      if (user.role_id.code === 'CLIENT' && customer_info) {  
        const customer = await Customer.findOne({ moral_user_id: moralUser._id });  
        if (customer) {  
          const customerUpdateFields = {};  
          if (customer_info.credit_limite !== undefined) {  
            customerUpdateFields.credit_limite = customer_info.credit_limite;  
          }  
            
          if (Object.keys(customerUpdateFields).length > 0) {  
            const updatedCustomer = await Customer.findOneAndUpdate(  
              { moral_user_id: moralUser._id },  
              customerUpdateFields,  
              { new: true }  
            );  
            updatedData.customer_info = updatedCustomer;  
          }  
        }  
      }  
    }  
  
    res.json({  
      success: true,  
      message: 'Profil mis à jour avec succès',  
      data: updatedData  
    });  
  
  } catch (error) {  
    console.error('Erreur lors de la mise à jour du profil:', error);  
      
    // Gestion des erreurs de validation  
    if (error.name === 'ValidationError') {  
      return res.status(400).json({  
        success: false,  
        message: 'Erreur de validation',  
        errors: Object.values(error.errors).map(err => err.message)  
      });  
    }  
      
    // Gestion des erreurs de duplication (CIN, ICE, etc.)  
    if (error.code === 11000) {  
      const field = Object.keys(error.keyPattern)[0];  
      return res.status(400).json({  
        success: false,  
        message: `Ce ${field} est déjà utilisé par un autre utilisateur`  
      });  
    }  
  
    res.status(500).json({  
      success: false,  
      message: 'Erreur interne du serveur',  
      error: error.message  
    });  
  }  
};  
  
module.exports = {  
  getProfile,  
  updateProfile  
};