const mongoose = require('mongoose');  
  
const StockLineSchema = new mongoose.Schema({  
  stock_depot_id: { type: mongoose.Schema.Types.ObjectId, ref: 'StockDepot', required: true },  
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },  
  um_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Um', required: true },  
  quantite_theorique: { type: Number, default: 0 },  
  quantite_physique: { type: Number, default: 0 },  
  quantite_disponible: { type: Number, default: 0 },  
  quantite_reservee: { type: Number, default: 0 },  
  seuil_alerte: { type: Number, default: 0 },  
  prix_unitaire: Number,  
}, { timestamps: true });  
  
StockLineSchema.index({ stock_depot_id: 1, product_id: 1, um_id: 1 }, { unique: true });  
StockLineSchema.index({ product_id: 1 });  
  
module.exports = mongoose.model('StockLine', StockLineSchema);