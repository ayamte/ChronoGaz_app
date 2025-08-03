/*Vérification des tokens JWT*/
const jwt = require('jsonwebtoken');  
const User = require('../models/User');  
  
const authenticateToken = async (req, res, next) => {  
  const authHeader = req.headers['authorization'];  
  const token = authHeader && authHeader.split(' ')[1];  
  
  if (!token) {  
    return res.status(401).json({  
      success: false,  
      message: 'Token d\'accès requis'  
    });  
  }  
  
  try {  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  
    const user = await User.findById(decoded.userId)  
      .populate('role_id', 'code nom');  
      
    if (!user || user.statut !== 'ACTIF') {  
      return res.status(401).json({  
        success: false,  
        message: 'Token invalide ou utilisateur inactif'  
      });  
    }  
  
    req.user = user;  
    next();  
  } catch (error) {  
    return res.status(403).json({  
      success: false,  
      message: 'Token invalide'  
    });  
  }  
};  
  
module.exports = { authenticateToken };