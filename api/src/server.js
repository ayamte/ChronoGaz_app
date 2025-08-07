const express = require('express');    
const cors = require('cors');    
const connectDB = require('./config/database');    
  
// Import des routes d'authentification  
const authRoutes = require('./routes/authRouter');  
  
// Import des modèles    
const Role = require('./models/Role');    
const User = require('./models/User');    
const PhysicalUser = require('./models/PhysicalUser');    
const MoralUser = require('./models/MoralUser');    
const Customer = require('./models/Customer');    
const Employe = require('./models/Employe');    
const Product = require('./models/Product');    
const Truck = require('./models/Truck');    
const Region = require('./models/Region');    
const usersRouter = require('./routes/usersRouter'); 
  
// Import du middleware d'authentification  
const { authenticateToken } = require('./middleware/authMiddleware');  
  
require('dotenv').config();    
  
const app = express();    
  
// Connexion à MongoDB    
connectDB();    
  
// Middleware    
app.use(cors());    
app.use(express.json());    
app.use(express.urlencoded({ extended: true }));   
app.use('/api/users', usersRouter); 
  
// Routes d'authentification (publiques)  
app.use('/api/auth', authRoutes);  
  
// Routes de test et santé    
app.get('/api/health', (req, res) => {    
  res.json({     
    message: 'ChronoGaz API is running with MongoDB!',    
    database: 'chronogaz_db',    
    timestamp: new Date().toISOString(),    
    collections: [    
      'users', 'roles', 'physicalusers', 'moralusers',     
      'customers', 'employes', 'products', 'trucks',     
      'regions', 'addresses', 'commandes'    
    ]    
  });    
});    
  
// Route pour tester les rôles    
app.get('/api/roles', async (req, res) => {    
  try {    
    const roles = await Role.find({ actif: true });    
    res.json({    
      success: true,    
      count: roles.length,    
      data: roles    
    });    
  } catch (error) {    
    res.status(500).json({     
      success: false,    
      error: error.message     
    });    
  }    
});    
  
// Route protégée pour tester les utilisateurs    
app.get('/api/users', authenticateToken, async (req, res) => {    
  try {    
    const users = await User.find()    
      .populate('role_id', 'code nom')    
      .select('-password_hash');    
    res.json({    
      success: true,    
      count: users.length,    
      data: users    
    });    
  } catch (error) {    
    res.status(500).json({     
      success: false,    
      error: error.message     
    });    
  }    
});    
  
// Route pour tester les produits    
app.get('/api/products', async (req, res) => {    
  try {    
    const products = await Product.find({ actif: true })    
      .populate('category_id', 'code nom');    
    res.json({    
      success: true,    
      count: products.length,    
      data: products    
    });    
  } catch (error) {    
    res.status(500).json({     
      success: false,    
      error: error.message     
    });    
  }    
});    

// ==================== ROUTES CLIENTS CRUD ====================

// GET - Récupérer tous les clients
app.get('/api/customers', authenticateToken, async (req, res) => {      
  try {      
    const customers = await Customer.find()  
      .populate({  
        path: 'physical_user_id',  
        populate: {  
          path: 'user_id',  
          select: 'email'  
        }  
      })  
      .populate({  
        path: 'moral_user_id',  
        populate: {  
          path: 'user_id',  
          select: 'email'  
        }  
      });      
    res.json({      
      success: true,      
      count: customers.length,      
      data: customers      
    });      
  } catch (error) {      
    res.status(500).json({       
      success: false,      
      error: error.message       
    });      
  }      
});

// GET - Récupérer un client par ID
app.get('/api/customers', authenticateToken, async (req, res) => {  
  try {  
    const customers = await Customer.find()  
      .populate({  
        path: 'physical_user_id',  
        populate: {  
          path: 'user_id',  
          select: 'email'  
        }  
      })  
      .populate({  
        path: 'moral_user_id',  
        populate: {  
          path: 'user_id',  
          select: 'email'  
        }  
      });  
  
    // Formater les données pour inclure explicitement statut, région, email  
    const formattedCustomers = customers.map(customer => ({  
      ...customer.toObject(),  
      // Ajouter des champs formatés pour faciliter l'accès frontend  
      formatted_data: {  
        statut: customer.statut,  
        region: customer.physical_user_id?.region_principale ||   
               customer.moral_user_id?.region_principale || 'N/A',  
        email: customer.physical_user_id?.user_id?.email ||   
              customer.moral_user_id?.user_id?.email || 'N/A'  
      }  
    }));  
  
    res.json({  
      success: true,  
      count: formattedCustomers.length,  
      data: formattedCustomers  
    });  
  } catch (error) {  
    res.status(500).json({  
      success: false,  
      error: error.message  
    });  
  }  
});

// POST - Créer un nouveau client
app.post('/api/customers', authenticateToken, async (req, res) => {    
  try {    
    const { type_client, profile, statut } = req.body;  
        
    // Créer d'abord l'utilisateur de base    
    const roleClient = await Role.findOne({ code: 'CLIENT' });    
    if (!roleClient) {    
      return res.status(400).json({ success: false, message: 'Rôle CLIENT non trouvé' });    
    }    
        
    const bcrypt = require('bcrypt');    
    const defaultPassword = 'ChronoGaz2024';    
    const saltRounds = 10;    
    const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);    
        
    const newUser = new User({    
      email: profile.email,    
      password_hash: hashedPassword,    
      role_id: roleClient._id,    
      statut: 'ACTIF'    
    });    
    
    const savedUser = await newUser.save();    
    
    let physicalUserId = null, moralUserId = null;    
    
    if (type_client === 'PHYSIQUE') {    
      const physicalUser = new PhysicalUser({    
        user_id: savedUser._id,    
        first_name: profile.first_name,    
        last_name: profile.last_name,    
        civilite: profile.civilite || 'M',    
        telephone_principal: profile.telephone_principal,    
        ville: profile.ville, // AJOUTÉ  
        region_principale: profile.region_principale,  
        adresse_principale: profile.adresse_principale    
      });    
      const savedPhysical = await physicalUser.save();    
      physicalUserId = savedPhysical._id;    
    } else {    
      // CORRIGÉ: Inclure TOUS les champs pour MoralUser  
      const moralUser = new MoralUser({    
        user_id: savedUser._id,    
        raison_sociale: profile.raison_sociale,    
        ice: profile.ice, // AJOUTÉ  
        patente: profile.patente, // AJOUTÉ  
        rc: profile.rc, // AJOUTÉ  
        ville_rc: profile.ville_rc, // AJOUTÉ  
        telephone_principal: profile.telephone_principal,    
        ville: profile.ville, // AJOUTÉ  
        region_principale: profile.region_principale,  
        adresse_principale: profile.adresse_principale    
      });    
      const savedMoral = await moralUser.save();    
      moralUserId = savedMoral._id;    
    }    
    
    // Créer le client avec statut personnalisé    
    const customer = new Customer({    
      customer_code: `CLI-${Date.now()}`,    
      type_client,    
      physical_user_id: physicalUserId,    
      moral_user_id: moralUserId,    
      statut: statut || 'ACTIF'  
    });    
    
    const savedCustomer = await customer.save();    
    const populatedCustomer = await Customer.findById(savedCustomer._id)    
      .populate({    
        path: 'physical_user_id',    
        populate: { path: 'user_id', select: 'email' }    
      })    
      .populate({    
        path: 'moral_user_id',    
        populate: { path: 'user_id', select: 'email' }    
      });    
    
    res.json({ success: true, data: populatedCustomer });    
  } catch (error) {    
    console.error('Erreur création client:', error);    
    res.status(400).json({ success: false, message: error.message });    
  }    
});

// PUT - Mettre à jour un client
app.put('/api/customers/:id', authenticateToken, async (req, res) => {  
  try {  
    const { profile, statut } = req.body;  
    const customer = await Customer.findById(req.params.id)  
      .populate('physical_user_id')  
      .populate('moral_user_id');  
  
    if (!customer) {  
      return res.status(404).json({ success: false, message: 'Client non trouvé' });  
    }  
  
    // Mettre à jour le statut du Customer  
    if (statut && ['ACTIF', 'INACTIF', 'SUSPENDU', 'EN_ATTENTE'].includes(statut)) {  
      await Customer.findByIdAndUpdate(req.params.id, { statut });  
    }  
  
    // Mettre à jour l'email dans User si fourni  
    if (profile?.email) {  
      const userId = customer.physical_user_id?.user_id || customer.moral_user_id?.user_id;  
      if (userId) {  
        await User.findByIdAndUpdate(userId, { email: profile.email });  
      }  
    }  
  
    // Mettre à jour le profile selon le type  
    if (profile) {  
      const profileUpdate = { ...profile };  
      delete profileUpdate.email; // Retirer email du profile car déjà traité  
  
      if (customer.type_client === 'PHYSIQUE' && customer.physical_user_id) {  
        await PhysicalUser.findByIdAndUpdate(customer.physical_user_id._id, profileUpdate);  
      } else if (customer.type_client === 'MORAL' && customer.moral_user_id) {  
        await MoralUser.findByIdAndUpdate(customer.moral_user_id._id, profileUpdate);  
      }  
    }  
  
    const updatedCustomer = await Customer.findById(req.params.id)  
      .populate({  
        path: 'physical_user_id',  
        populate: { path: 'user_id', select: 'email' }  
      })  
      .populate({  
        path: 'moral_user_id',   
        populate: { path: 'user_id', select: 'email' }  
      });  
  
    res.json({ success: true, data: updatedCustomer });  
  } catch (error) {  
    res.status(400).json({ success: false, message: error.message });  
  }  
});

// DELETE - Supprimer un client
app.delete('/api/customers/:id', authenticateToken, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Client non trouvé' });
    }

    // Supprimer les données liées
    if (customer.physical_user_id) {
      const physicalUser = await PhysicalUser.findById(customer.physical_user_id);
      if (physicalUser) {
        await User.findByIdAndDelete(physicalUser.user_id);
        await PhysicalUser.findByIdAndDelete(customer.physical_user_id);
      }
    }
    if (customer.moral_user_id) {
      const moralUser = await MoralUser.findById(customer.moral_user_id);
      if (moralUser) {
        await User.findByIdAndDelete(moralUser.user_id);
        await MoralUser.findByIdAndDelete(customer.moral_user_id);
      }
    }

    await Customer.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Client supprimé avec succès' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ==================== ROUTES ENTREPRISES ====================

// GET - Récupérer les clients d'une entreprise spécifique  
app.get('/api/customers/company/:companyId', authenticateToken, async (req, res) => {    
  try {    
    const { companyId } = req.params;    
    const user = req.user;    
        
    // Vérifier que l'utilisateur est une entreprise et accède à ses propres clients    
    if (user.role_id.code !== 'CLIENT' || !user.moral_user_id) {    
      return res.status(403).json({ success: false, message: 'Accès non autorisé' });    
    }    
        
    // Récupérer tous les clients physiques et filtrer ceux liés à cette entreprise  
    const customers = await Customer.find({ type_client: 'PHYSIQUE' })  
      .populate({    
        path: 'physical_user_id',    
        populate: {    
          path: 'user_id',    
          select: 'email'    
        }    
      });  
      
    // Filtrer les clients qui ont le moral_user_id correspondant  
    const companyClients = customers.filter(customer =>   
      customer.physical_user_id &&   
      customer.physical_user_id.moral_user_id &&   
      customer.physical_user_id.moral_user_id.toString() === companyId  
    );  
        
    res.json({    
      success: true,    
      count: companyClients.length,    
      data: companyClients    
    });    
  } catch (error) {    
    res.status(500).json({ success: false, error: error.message });    
  }    
});

// POST - Créer un client particulier pour une entreprise spécifique  
app.post('/api/customers/company', authenticateToken, async (req, res) => {  
  try {  
    const user = req.user;  
      
    // Vérifier que l'utilisateur est une entreprise  
    if (user.role_id.code !== 'CLIENT' || !user.moral_user_id) {  
      return res.status(403).json({   
        success: false,   
        message: 'Seules les entreprises peuvent créer des clients particuliers'   
      });  
    }  

    const { profile } = req.body;  
      
    // Validation des champs requis pour un particulier  
    if (!profile?.first_name || !profile?.last_name || !profile?.civilite || !profile?.email) {  
      return res.status(400).json({  
        success: false,  
        message: 'Prénom, nom, civilité et email sont requis'  
      });  
    }  

    // Créer l'utilisateur de base avec mot de passe par défaut  
    const roleClient = await Role.findOne({ code: 'CLIENT' });  
    if (!roleClient) {  
      return res.status(400).json({ success: false, message: 'Rôle CLIENT non trouvé' });  
    }  

    const bcrypt = require('bcrypt');  
    const defaultPassword = 'ChronoGaz2024';  
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);  

    const newUser = new User({  
      email: profile.email,  
      password_hash: hashedPassword,  
      role_id: roleClient._id,  
      statut: 'ACTIF'  
    });  
    await newUser.save();  

    // Créer le PhysicalUser lié à l'entreprise  
    const physicalUser = new PhysicalUser({  
      user_id: newUser._id,  
      first_name: profile.first_name,  
      last_name: profile.last_name,  
      civilite: profile.civilite,  
      telephone_principal: profile.telephone_principal,  
      adresse_principale: profile.adresse_principale,  
      moral_user_id: user.moral_user_id // LIER À L'ENTREPRISE CONNECTÉE  
    });  
    await physicalUser.save();  

    // Créer le Customer  
    const customer_code = `CLI-P${Date.now()}`;  
    const customer = new Customer({  
      customer_code,  
      type_client: 'PHYSIQUE',  
      physical_user_id: physicalUser._id,  
      statut: 'ACTIF'  
    });  
    await customer.save();  

    const populatedCustomer = await Customer.findById(customer._id)  
      .populate({  
        path: 'physical_user_id',  
        populate: {  
          path: 'user_id',  
          select: 'email'  
        }  
      });  

    res.status(201).json({   
      success: true,   
      message: 'Client particulier créé avec succès',  
      data: populatedCustomer   
    });  

  } catch (error) {  
    console.error('Erreur création client entreprise:', error);    
        
    if (error.code === 11000) {    
      return res.status(400).json({    
        success: false,    
        message: 'Cet email est déjà utilisé'    
      });    
    }    
        
    res.status(500).json({     
      success: false,     
      message: 'Erreur interne du serveur',    
      error: error.message     
    });    
  }    
});  
  
// ==================== ROUTES EMPLOYÉS CRUD ====================  
  
// GET - Récupérer tous les employés  
app.get('/api/employees', authenticateToken, async (req, res) => {  
  try {  
    const employees = await Employe.find()  
      .populate({  
        path: 'physical_user_id',  
        populate: {  
          path: 'user_id',  
          select: 'email'  
        }  
      });  
    res.json({ success: true, count: employees.length, data: employees });  
  } catch (error) {  
    res.status(500).json({ success: false, error: error.message });  
  }  
});  
  
// GET - Récupérer un employé par ID  
app.get('/api/employees/:id', authenticateToken, async (req, res) => {  
  try {  
    const employee = await Employe.findById(req.params.id)  
      .populate({  
        path: 'physical_user_id',  
        populate: { path: 'user_id', select: 'email statut' }  
      });  
        
    if (!employee) {  
      return res.status(404).json({ success: false, message: 'Employé non trouvé' });  
    }  
      
    res.json({ success: true, data: employee });  
  } catch (error) {  
    res.status(500).json({ success: false, error: error.message });  
  }  
});  
  
// POST - Créer un nouvel employé  
app.post('/api/employees', authenticateToken, async (req, res) => {      
  try {      
    const { profile, fonction, statut } = req.body;      
          
    // Déterminer le rôle selon la fonction    
    let roleCode = 'EMPLOYE'; // Par défaut pour chauffeurs et accompagnants      
    if (fonction === 'MAGASINIER') {      
      roleCode = 'EMPLOYE_MAGASIN';      
    }      
          
    const roleEmploye = await Role.findOne({ code: roleCode });      
    if (!roleEmploye) {      
      return res.status(400).json({ success: false, message: `Rôle ${roleCode} non trouvé` });      
    }      
      
    const bcrypt = require('bcrypt');      
        
    const defaultPassword = 'ChronoGaz2024';      
    const saltRounds = 10;      
    const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);      
          
    const newUser = new User({        
      email: profile.email,        
      password_hash: hashedPassword,        
      role_id: roleEmploye._id,  
      password_temporary: true, // AJOUTÉ  
      first_login: true // AJOUTÉ  
    });    
    const savedUser = await newUser.save();    
    
    // Créer l'utilisateur physique avec région    
    const physicalUser = new PhysicalUser({      
      user_id: savedUser._id,      
      first_name: profile.first_name,      
      last_name: profile.last_name,      
      civilite: profile.civilite || 'M',      
      telephone_principal: profile.telephone_principal,      
      region_principale: profile.region_principale,  
      ville: profile.ville, // AJOUTÉ  
      adresse_principale: profile.adresse_principale  
    });     
    const savedPhysical = await physicalUser.save();    
    
    // Créer l'employé avec tous les champs    
    const employee = new Employe({      
      physical_user_id: savedPhysical._id,      
      matricule: `EMP${(Date.now()).toString().padStart(6, '0')}`, // AMÉLIORÉ  
      cin: profile.cin,    
      cnss: profile.cnss,  
      fonction,      
      date_embauche: new Date(),      
      statut: statut || 'ACTIF'
    });
    
    const savedEmployee = await employee.save();    
    const populatedEmployee = await Employe.findById(savedEmployee._id)    
      .populate({    
        path: 'physical_user_id',    
        populate: { path: 'user_id', select: 'email statut' }    
      });    
    
    res.json({ success: true, data: populatedEmployee });    
  } catch (error) {    
    console.error('Erreur création employé:', error);    
    res.status(400).json({ success: false, message: error.message });    
  }    
});  
  
// PUT - Mettre à jour un employé  
app.put('/api/employees/:id', authenticateToken, async (req, res) => {      
  try {      
    const { profile, fonction, statut } = req.body;      
    const employee = await Employe.findById(req.params.id)      
      .populate('physical_user_id');      
      
    if (!employee) {      
      return res.status(404).json({ success: false, message: 'Employé non trouvé' });      
    }      
      
    // Mettre à jour les données de l'employé      
    if (fonction) employee.fonction = fonction;      
    if (statut !== undefined) employee.statut = statut; // AJOUTÉ  
    if (profile.cin !== undefined) employee.cin = profile.cin;  
    if (profile.cnss !== undefined) employee.cnss = profile.cnss;  
    await employee.save();     
      
    // AJOUTÉ: Mettre à jour l'email dans User si fourni  
    if (profile?.email && employee.physical_user_id) {  
      await User.findByIdAndUpdate(employee.physical_user_id.user_id, {   
        email: profile.email   
      });  
    }  
      
    // Mettre à jour les données physiques      
    if (profile && employee.physical_user_id) {      
      const updateFields = {  
        first_name: profile.first_name,      
        last_name: profile.last_name,      
        civilite: profile.civilite, // AJOUTÉ  
        telephone_principal: profile.telephone_principal,      
        region_principale: profile.region_principale,  
        ville: profile.ville,  
        adresse_principale: profile.adresse_principale  
      };  
      await PhysicalUser.findByIdAndUpdate(employee.physical_user_id._id, updateFields);      
    }     
      
    const updatedEmployee = await Employe.findById(req.params.id)      
      .populate({      
        path: 'physical_user_id',      
        populate: { path: 'user_id', select: 'email statut' }      
      });      
      
    res.json({ success: true, data: updatedEmployee });      
  } catch (error) {      
    res.status(400).json({ success: false, message: error.message });      
  }      
});
  
// DELETE - Supprimer un employé  
app.delete('/api/employees/:id', authenticateToken, async (req, res) => {  
  try {  
    const employee = await Employe.findById(req.params.id);    
    if (!employee) {    
      return res.status(404).json({ success: false, message: 'Employé non trouvé' });    
    }    
    
    // Supprimer les données liées    
    if (employee.physical_user_id) {    
      const physicalUser = await PhysicalUser.findById(employee.physical_user_id);    
      if (physicalUser) {    
        await User.findByIdAndDelete(physicalUser.user_id);    
        await PhysicalUser.findByIdAndDelete(employee.physical_user_id);    
      }    
    }    
    
    await Employe.findByIdAndDelete(req.params.id);    
    res.json({ success: true, message: 'Employé supprimé avec succès' });    
  } catch (error) {    
    res.status(400).json({ success: false, message: error.message });    
  }    
});    
    
// Route protégée pour tester les camions        
app.get('/api/trucks', authenticateToken, async (req, res) => {        
  try {        
    const trucks = await Truck.find({ actif: true })        
      .populate('region_id', 'code nom');        
    res.json({        
      success: true,        
      count: trucks.length,        
      data: trucks        
    });        
  } catch (error) {        
    res.status(500).json({         
      success: false,        
      error: error.message         
    });        
  }        
});        
      
// Route protégée pour les statistiques générales        
app.get('/api/stats', authenticateToken, async (req, res) => {        
  try {        
    const stats = {        
      users: await User.countDocuments(),        
      customers: await Customer.countDocuments(),        
      products: await Product.countDocuments({ actif: true }),        
      trucks: await Truck.countDocuments({ actif: true }),        
      roles: await Role.countDocuments({ actif: true })        
    };        
            
    res.json({        
      success: true,        
      data: stats,        
      timestamp: new Date().toISOString()        
    });        
  } catch (error) {        
    res.status(500).json({         
      success: false,        
      error: error.message         
    });        
  }        
});        
      
// Gestion des erreurs 404        
app.use('*', (req, res) => {        
  res.status(404).json({        
    success: false,        
    message: 'Route non trouvée',        
    availableRoutes: [        
      'POST /api/auth/register',      
      'POST /api/auth/login',      
      'GET /api/health',        
      'GET /api/users (protégée)',        
      'GET /api/products',        
      'GET /api/customers (protégée)',    
      'POST /api/customers (protégée)',    
      'PUT /api/customers/:id (protégée)',    
      'DELETE /api/customers/:id (protégée)',    
      'GET /api/customers/:id (protégée)',  
      'GET /api/customers/company/:companyId (protégée)',  
      'POST /api/customers/company (protégée)',  
      'GET /api/employees (protégée)',    
      'POST /api/employees (protégée)',    
      'PUT /api/employees/:id (protégée)',    
      'DELETE /api/employees/:id (protégée)',    
      'GET /api/employees/:id (protégée)',    
      'GET /api/trucks (protégée)',        
      'GET /api/stats (protégée)'        
    ]        
  });        
});        
      
// Gestion globale des erreurs        
app.use((err, req, res, next) => {        
  console.error('Erreur serveur:', err.stack);        
  res.status(500).json({        
    success: false,        
    message: 'Erreur interne du serveur',        
    error: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'        
  });        
});        
  
const PORT = process.env.PORT || 5000;        
      
app.listen(PORT, () => {        
  console.log(`🚀 ChronoGaz server running on port ${PORT}`);        
  console.log(`📊 MongoDB connected to chronogaz_db`);        
  console.log(`🔗 API Health: http://localhost:${PORT}/api/health`);        
  console.log(`🔐 Auth Register: http://localhost:${PORT}/api/auth/register`);      
  console.log(`🔐 Auth Login: http://localhost:${PORT}/api/auth/login`);      
  console.log(`📈 API Stats: http://localhost:${PORT}/api/stats`);        
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);        
});        
      
module.exports = app;
