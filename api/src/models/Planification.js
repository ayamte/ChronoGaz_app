const mongoose = require('mongoose');  
  
const PlanificationSchema = new mongoose.Schema({  
  commande_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Commande', required: true },  
  truck_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck', required: true },  
  livreur_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Employe', required: true },  
  accompagnateur_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Employe' },  
  date_planifiee: { type: Date, required: true },  
  date_debut_reel: Date,  
  date_fin_reel: Date,  
  statut: { type: String, enum: ['PLANIFIE', 'EN_COURS', 'LIVRE', 'ANNULE', 'REPORTE'], default: 'PLANIFIE' },  
  ordre_livraison: { type: Number, default: 1 },  
  commentaires: String,  
}, { timestamps: true });  
  
PlanificationSchema.index({ commande_id: 1 });  
PlanificationSchema.index({ truck_id: 1 });  
PlanificationSchema.index({ date_planifiee: 1 });  
  
module.exports = mongoose.model('Planification', PlanificationSchema);