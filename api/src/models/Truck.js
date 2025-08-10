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
    
  // Nouveaux champs pour compatibilité  
  status: {   
    type: String,   
    enum: ['Disponible', 'En livraison', 'En maintenance', 'Hors service'],   
    default: 'Disponible'   
  },  
  mileage: { type: Number, default: 0 },  
  lastMaintenanceDate: Date,  
  nextMaintenanceDate: Date,  
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Employe' }  
}, { timestamps: true });    
  
// Méthodes nécessaires  
TruckSchema.methods.isMaintenanceDue = function() {  
  if (!this.nextMaintenanceDate) return false;  
  return new Date() > this.nextMaintenanceDate;  
};  
  
TruckSchema.methods.updateStatus = function(newStatus) {  
  this.status = newStatus;  
  return this.save();  
};
  
module.exports = mongoose.model('Truck', TruckSchema);