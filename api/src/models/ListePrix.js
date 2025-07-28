const mongoose = require('mongoose');  
  
const ListePrixSchema = new mongoose.Schema({  
  code: { type: String, required: true, unique: true },  
  nom: { type: String, required: true },  
  description: String,  
  date_debut: { type: Date, required: true },  
  date_fin: Date,  
  actif: { type: Boolean, default: true },  
}, { timestamps: true });  
  
ListePrixSchema.index({ code: 1 });  
ListePrixSchema.index({ date_debut: 1, date_fin: 1 });  
  
module.exports = mongoose.model('ListePrix', ListePrixSchema);