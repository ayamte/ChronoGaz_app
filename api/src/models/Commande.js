const mongoose = require('mongoose');  
require('../models/Address');
require('../models/StatutCommande');
require('../models/Customer');
  
const CommandeSchema = new mongoose.Schema({  
  numero_commande: { type: String, required: true, unique: true },  
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },  
  address_livraison_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },  
  date_commande: { type: Date, default: Date.now },  
  date_souhaite: Date,  
  statut_id: { type: mongoose.Schema.Types.ObjectId, ref: 'StatutCommande', required: true },  
  total_ht: { type: Number, default: 0 },  
  total_tva: { type: Number, default: 0 },  
  total_ttc: { type: Number, default: 0 },  
  mode_paiement: { type: String, enum: ['ESPECES', 'CHEQUE', 'VIREMENT', 'CARTE'], default: 'ESPECES' },  
  commentaires: String,  
  urgent: { type: Boolean, default: false },  
}, { timestamps: true });  
  
CommandeSchema.index({ numero_commande: 1 });  
CommandeSchema.index({ customer_id: 1 });  
CommandeSchema.index({ statut_id: 1 });  
CommandeSchema.index({ date_commande: -1 });  
  
module.exports = mongoose.model('Commande', CommandeSchema);