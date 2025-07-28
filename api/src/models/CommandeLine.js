const mongoose = require('mongoose');  
  
const CommandeLineSchema = new mongoose.Schema({  
  commande_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Commande', required: true },  
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },  
  um_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Um', required: true },  
  quantite: { type: Number, required: true },  
  prix_unitaire: { type: Number, required: true },  
  total_ligne: { type: Number, required: true },  
}, { timestamps: true });  
  
CommandeLineSchema.index({ commande_id: 1 });  
CommandeLineSchema.index({ product_id: 1 });  
  
module.exports = mongoose.model('CommandeLine', CommandeLineSchema);