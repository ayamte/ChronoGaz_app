const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({  
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  
  numappt: String,  
  numimmeuble: String,  
  street: { type: String, required: true },  
  city_id: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },  
  region_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Region', required: true },  
  postal_code: String,  
  is_principal: { type: Boolean, default: false },  
  latitude: Number,  // Pour GPS futur  
  longitude: Number, // Pour GPS futur  
  type_adresse: {   
    type: String,   
    enum: ['DOMICILE', 'TRAVAIL', 'LIVRAISON', 'FACTURATION'],   
    default: 'DOMICILE'   
  },  
  actif: { type: Boolean, default: true }  
}, { timestamps: true });

module.exports = mongoose.model('Address', AddressSchema);