const mongoose = require('mongoose');  
  
const UmSchema = new mongoose.Schema({  
  code: { type: String, required: true, unique: true },  
  nom: { type: String, required: true },  
  symbole: String,  
  type: { type: String, enum: ['POIDS', 'VOLUME', 'UNITE', 'LONGUEUR'], required: true },  
  facteur_conversion: { type: Number, default: 1 },  
  actif: { type: Boolean, default: true },  
}, { timestamps: true });  
  
UmSchema.index({ code: 1 });  
UmSchema.index({ type: 1 });  
  
module.exports = mongoose.model('Um', UmSchema);