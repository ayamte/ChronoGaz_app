const mongoose = require('mongoose');  
  
const LivraisonSchema = new mongoose.Schema({  
  planification_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Planification', required: true },  
  date_livraison: { type: Date, required: true },  
  statut: { type: String, enum: ['EN_COURS', 'LIVREE', 'ECHEC', 'PARTIELLE'], default: 'EN_COURS' },  
  latitude_livraison: Number,  
  longitude_livraison: Number,  
  signature_client: Buffer,  
  photo_livraison: String,  
  commentaires_livreur: String,  
  evaluation_client: Number,  
  commentaires_client: String,  
}, { timestamps: true });  
  
LivraisonSchema.index({ planification_id: 1 });  
LivraisonSchema.index({ date_livraison: -1 });  
  
module.exports = mongoose.model('Livraison', LivraisonSchema);