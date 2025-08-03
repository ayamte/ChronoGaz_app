const mongoose = require('mongoose');  
const jwt = require('jsonwebtoken');  
const User = require('../models/User');  
const Role = require('../models/Role');  
const PhysicalUser = require('../models/PhysicalUser');  
const MoralUser = require('../models/MoralUser');  
const Customer = require('../models/Customer');  
const Employe = require('../models/Employe');  
const { hashPassword, comparePassword } = require('../utils/password');  
const { generateCustomerCode } = require('../utils/customerCode');
  
const register = async (req, res) => {  
  try {  
    const {   
      email,   
      password,   
      role_code,   
      type_personne,   
      profile   
    } = req.body;  
  
    // Validation des données requises  
    if (!email || !password || !role_code || !type_personne) {  
      return res.status(400).json({  
        success: false,  
        message: 'Email, mot de passe, rôle et type de personne sont requis'  
      });  
    }  
  
    // Validation des régions autorisées  
    const regionsAutorisees = ['2 Mars', 'Maarif', 'Bir Anzarane', 'Boulevard al qods'];  
      
    if (profile?.region_principale && !regionsAutorisees.includes(profile.region_principale)) {  
      return res.status(400).json({  
        success: false,  
        message: `Région invalide. Les régions autorisées sont : ${regionsAutorisees.join(', ')}`  
      });  
    }  
  
    // Vérifier si l'utilisateur existe déjà  
    const existingUser = await User.findOne({ email });  
    if (existingUser) {  
      return res.status(400).json({  
        success: false,  
        message: 'Un utilisateur avec cet email existe déjà'  
      });  
    }  
  
    // 1. Trouver le rôle  
    const role = await Role.findOne({ code: role_code });  
    if (!role) {  
      return res.status(400).json({  
        success: false,  
        message: 'Rôle invalide'  
      });  
    }  
  
    // 2. Hacher le mot de passe  
    const password_hash = await hashPassword(password);  
  
    // 3. Créer l'utilisateur principal  
    const newUser = new User({  
      email,  
      password_hash,  
      role_id: role._id,  
      statut: 'ACTIF'  
    });  
    await newUser.save();  
  
    let responseData = {  
      user: {  
        id: newUser._id,  
        email: newUser.email,  
        role: role.code,  
        statut: newUser.statut  
      }  
    };  
  
    // 4. Créer selon le type de personne  
    if (type_personne === 'PHYSIQUE') {  
      // Validation pour personne physique  
      if (!profile?.first_name || !profile?.last_name || !profile?.civilite) {  
        throw new Error('Prénom, nom et civilité sont requis pour une personne physique');  
      }  
  
      const physicalUser = new PhysicalUser({  
        user_id: newUser._id,  
        first_name: profile.first_name,  
        last_name: profile.last_name,  
        civilite: profile.civilite,  
        cin: profile.cin,  
        telephone_principal: profile.telephone_principal,  
        adresse_principale: profile.adresse_principale,  
        ville: profile.ville,  
        region_principale: profile.region_principale  
      });  
      await physicalUser.save();  
  
      responseData.physical_user = physicalUser;  
  
      // 5. Créer selon le rôle  
      if (role_code === 'CLIENT') {  
        const customer_code = await generateCustomerCode('PHYSIQUE');  
        const customer = new Customer({  
          customer_code,  
          type_client: 'PHYSIQUE',  
          physical_user_id: physicalUser._id  
        });  
        await customer.save();  
        responseData.customer = customer;  
      } else if (role_code === 'EMPLOYE') {  
        if (!profile?.fonction || !profile?.date_embauche) {  
          throw new Error('Fonction et date d\'embauche sont requises pour un employé');  
        }  
          
        const employeCount = await Employe.countDocuments();  
        const matricule = `EMP${(employeCount + 1).toString().padStart(6, '0')}`;  
          
        const employe = new Employe({  
          physical_user_id: physicalUser._id,  
          matricule,  
          fonction: profile.fonction,  
          date_embauche: profile.date_embauche,  
          cnss: profile.cnss,  
          salaire_base: profile.salaire_base  
        });  
        await employe.save();  
        responseData.employe = employe;  
      }  
    } else if (type_personne === 'MORAL') {  
      // Validation pour personne morale  
      if (!profile?.raison_sociale) {  
        throw new Error('Raison sociale est requise pour une entreprise');  
      }  
  
      const moralUser = new MoralUser({  
        user_id: newUser._id,  
        raison_sociale: profile.raison_sociale,  
        ice: profile.ice,  
        patente: profile.patente,  
        rc: profile.rc,  
        ville_rc: profile.ville_rc,  
        forme_juridique: profile.forme_juridique,  
        secteur_activite: profile.secteur_activite,  
        telephone_principal: profile.telephone_principal,  
        adresse_principale: profile.adresse_principale,  
        ville: profile.ville,  
        region_principale: profile.region_principale  
      });  
      await moralUser.save();  
  
      responseData.moral_user = moralUser;  
  
      // Seules les entreprises peuvent être clients  
      if (role_code === 'CLIENT') {  
        const customer_code = await generateCustomerCode('MORAL');  
        const customer = new Customer({  
          customer_code,  
          type_client: 'MORAL',  
          moral_user_id: moralUser._id  
        });  
        await customer.save();  
        responseData.customer = customer;  
      }  
    }  
  
    res.status(201).json({  
      success: true,  
      message: 'Utilisateur créé avec succès',  
      data: responseData  
    });  
  
  } catch (error) {  
    console.error('Erreur lors de l\'inscription:', error);  
      
    // Gestion spécifique des erreurs de duplication  
    if (error.code === 11000) {  
      const field = Object.keys(error.keyPattern)[0];  
      return res.status(400).json({  
        success: false,  
        message: `Ce ${field} est déjà utilisé par un autre utilisateur`,  
        error: `Duplicate ${field}`  
      });  
    }  
      
    res.status(500).json({  
      success: false,  
      message: 'Erreur interne du serveur',  
      error: error.message  
    });  
  }  
};  
  
const login = async (req, res) => {  
  try {  
    const { email, password } = req.body;  
  
    // Validation des données requises  
    if (!email || !password) {  
      return res.status(400).json({  
        success: false,  
        message: 'Email et mot de passe sont requis'  
      });  
    }  
  
    // Trouver l'utilisateur avec son rôle  
    const user = await User.findOne({ email })  
      .populate('role_id', 'code nom');  
  
    if (!user) {  
      return res.status(401).json({  
        success: false,  
        message: 'Email ou mot de passe incorrect'  
      });  
    }  
  
    // Vérifier le statut de l'utilisateur  
    if (user.statut !== 'ACTIF') {  
      return res.status(401).json({  
        success: false,  
        message: 'Compte non activé ou suspendu'  
      });  
    }  
  
    // Vérifier le mot de passe  
    const isPasswordValid = await comparePassword(password, user.password_hash);  
    if (!isPasswordValid) {  
      return res.status(401).json({  
        success: false,  
        message: 'Email ou mot de passe incorrect'  
      });  
    }  
  
    // Générer le token JWT  
    const token = jwt.sign(  
      {   
        userId: user._id,   
        email: user.email,   
        role: user.role_id.code   
      },  
      process.env.JWT_SECRET,  
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }  
    );  
  
    // Mettre à jour la dernière connexion  
    await User.findByIdAndUpdate(user._id, {   
      last_login: new Date()   
    });  
  
    res.json({  
      success: true,  
      message: 'Connexion réussie',  
      data: {  
        token,  
        user: {  
          id: user._id,  
          email: user.email,  
          role: user.role_id.code,  
          statut: user.statut  
        }  
      }  
    });  
  
  } catch (error) {  
    console.error('Erreur lors de la connexion:', error);  
    res.status(500).json({  
      success: false,  
      message: 'Erreur interne du serveur',  
      error: error.message  
    });  
  }  
};  


module.exports = {  
  register,  
  login  
};