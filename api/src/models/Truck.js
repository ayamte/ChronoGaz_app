const mongoose = require('mongoose');  
  
const TruckSchema = new mongoose.Schema({  
  matricule: { type: String, required: true, unique: true },  
  marque: String,  
  modele: String,  
  annee_construction: Number,  
  capacite_charge: Number,  
  capacite_volume: Number,  
  carburant: { type: String, enum: ['ESSENCE', 'DIESEL', 'ELECTRIQUE', 'HYBRIDE'], default: 'DIESEL' },  
  puissance_fiscale: Number,  
  gps_actif: { type: Boolean, default: true },  
  region_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Region' },  
  depot_attache_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Depot' },  
  image_url: String,  
  actif: { type: Boolean, default: true },  
}, { timestamps: true });  
  
TruckSchema.index({ matricule: 1 });  
TruckSchema.index({ region_id: 1 });  
TruckSchema.index({ depot_attache_id: 1 });  
  
module.exports = mongoose.model('Truck', TruckSchema);