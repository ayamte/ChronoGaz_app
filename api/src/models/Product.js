const mongoose = require('mongoose');  
  
const ProductSchema = new mongoose.Schema({  
  reference: { type: String, required: true, unique: true },  
  nom_court: { type: String, required: true },  
  nom_long: String,  
  type_gaz: { type: String, enum: ['BUTANE', 'PROPANE', 'MIXTE'], required: true },  
  capacite: { type: Number, required: true },  
  prix_unitaire: Number,  
  actif: { type: Boolean, default: true }  
}, {  
  timestamps: true  
});  
  
module.exports = mongoose.model('Product', ProductSchema);