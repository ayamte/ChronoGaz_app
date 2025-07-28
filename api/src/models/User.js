const mongoose = require('mongoose');  
  
const UserSchema = new mongoose.Schema({  
  email: { type: String, required: true, unique: true },  
  password_hash: { type: String, required: true },  
  role: {  
    code: { type: String, enum: ['ADMIN', 'CLIENT', 'EMPLOYE'], required: true },  
    nom: String  
  },  
  statut: { type: String, enum: ['ACTIF', 'INACTIF', 'SUSPENDU', 'EN_ATTENTE'], default: 'EN_ATTENTE' },  
  profile: {  
    // Pour physical_user  
    first_name: String,  
    last_name: String,  
    civilite: { type: String, enum: ['M', 'Mme', 'Mlle'] },  
    cin: String,  
    telephone_principal: String,  
    // Pour moral_user  
    raison_sociale: String,  
    ice: String,  
    rc: String  
  },  
  customer_info: {  
    customer_code: String,  
    type_client: { type: String, enum: ['PHYSIQUE', 'MORAL'] },  
    credit_limite: { type: Number, default: 0 }  
  },  
  employee_info: {  
    matricule: String,  
    fonction: { type: String, enum: ['CHAUFFEUR', 'ACCOMPAGNANT', 'MAGASINIER'] },  
    date_embauche: Date  
  }  
}, {  
  timestamps: true  
});  
  
module.exports = mongoose.model('User', UserSchema);