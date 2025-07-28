// api/src/server.js  
const express = require('express');  
const cors = require('cors');  
const connectDB = require('./config/database');  
  
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
  
require('dotenv').config();  
  
const app = express();  
  
// Connexion à MongoDB  
connectDB();  
  
// Middleware  
app.use(cors());  
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));  
  
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
  
// Route pour tester les utilisateurs  
app.get('/api/users', async (req, res) => {  
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
  
// Route pour tester les clients  
app.get('/api/customers', async (req, res) => {  
  try {  
    const customers = await Customer.find({ statut: 'ACTIF' })  
      .populate('physical_user_id')  
      .populate('moral_user_id');  
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
  
// Route pour tester les camions  
app.get('/api/trucks', async (req, res) => {  
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
  
// Route pour les statistiques générales  
app.get('/api/stats', async (req, res) => {  
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
      'GET /api/health',  
      'GET /api/users',  
      'GET /api/products',  
      'GET /api/customers',  
      'GET /api/trucks',  
      'GET /api/stats'  
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
  console.log(`📈 API Stats: http://localhost:${PORT}/api/stats`);  
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);  
});  
  
module.exports = app;