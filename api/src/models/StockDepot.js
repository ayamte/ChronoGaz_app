const mongoose = require('mongoose');  
  
const StockDepotSchema = new mongoose.Schema({  
  depot_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Depot', required: true },  
  date_inventaire: { type: Date, default: Date.now },  
  type_inventaire: { type: String, enum: ['INITIAL', 'PERIODIQUE', 'EXCEPTIONNEL'], default: 'PERIODIQUE' },  
  responsable_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Employe', required: true },  
  statut: { type: String, enum: ['EN_COURS', 'VALIDE', 'ARCHIVE'], default: 'EN_COURS' },  
  commentaires: String,  
}, { timestamps: true });  
  
StockDepotSchema.index({ depot_id: 1 });  
StockDepotSchema.index({ date_inventaire: -1 });  
  
module.exports = mongoose.model('StockDepot', StockDepotSchema);