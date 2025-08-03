const mongoose = require('mongoose');  
  
const MoralUserSchema = new mongoose.Schema({  
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },  
  raison_sociale: { type: String, required: true },  
  ice: { type: String, unique: true, sparse: true },  
  patente: String,  
  rc: String,  
  ville_rc: String,  
  forme_juridique: String,  
  secteur_activite: String,  
  telephone_principal: String,  
  adresse_principale: String,  
  ville: String,  
  region_principale: {   
  type: String,   
  enum: ['2 Mars', 'Maarif', 'Bir Anzarane', 'Boulevard al qods'],  
  required: false  
},  
  actif: { type: Boolean, default: true },  
}, { timestamps: true });  
  
MoralUserSchema.index({ user_id: 1 });  
MoralUserSchema.index({ ice: 1 });  
MoralUserSchema.index({ raison_sociale: 1 });  
  
module.exports = mongoose.model('MoralUser', MoralUserSchema);