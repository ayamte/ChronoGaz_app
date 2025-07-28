const mongoose = require('mongoose');  
  
const DepotSchema = new mongoose.Schema({  
  code: { type: String, required: true, unique: true },  
  nom: { type: String, required: true },  
  description: String,  
  surface_totale: Number,  
  capacite_max: Number,  
  address_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },  
  region_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Region', required: true },  
  responsable_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Employe' },  
  actif: { type: Boolean, default: true },  
}, { timestamps: true });  
  
DepotSchema.index({ code: 1 });  
DepotSchema.index({ address_id: 1 });  
DepotSchema.index({ region_id: 1 });  
  
module.exports = mongoose.model('Depot', DepotSchema);