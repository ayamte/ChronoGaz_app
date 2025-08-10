const mongoose = require('mongoose');  
  
const ProductSchema = new mongoose.Schema({  
  ref: { type: String, required: true, unique: true }, // au lieu de 'reference'  
  long_name: { type: String, required: true }, // au lieu de 'nom_long'  
  short_name: { type: String, required: true }, // au lieu de 'nom_court'  
  gamme: { type: String }, // nouveau champ  
  brand: { type: String }, // nouveau champ  
  description: { type: String },  
  image: { type: Buffer }, // pour LONGBLOB  
  actif: { type: Boolean, default: true }  
}, {  
  timestamps: true  
});  
  
module.exports = mongoose.model('Product', ProductSchema);