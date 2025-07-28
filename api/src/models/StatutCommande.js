const mongoose = require('mongoose');  
  
const StatutCommandeSchema = new mongoose.Schema({  
  code: { type: String, required: true, unique: true },  
  nom: { type: String, required: true },  
  description: String,  
  ordre_affichage: { type: Number, required: true },  
  couleur: { type: String, default: '#000000' },  
  actif: { type: Boolean, default: true },  
}, { timestamps: true });  
  
StatutCommandeSchema.index({ code: 1 });  
StatutCommandeSchema.index({ ordre_affichage: 1 });  
  
module.exports = mongoose.model('StatutCommande', StatutCommandeSchema);