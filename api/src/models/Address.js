const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  num_appt: String,
  num_immeuble: String,
  rue: { type: String, required: true },
  quartier: String,
  ville: { type: String, required: true },
  code_postal: String,
  region_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Region', required: true },
  latitude: Number,
  longitude: Number,
  type_adresse: { type: String, enum: ['DOMICILE', 'TRAVAIL', 'DEPOT', 'FOURNISSEUR', 'LIVRAISON', 'FACTURATION'], default: 'DOMICILE' },
  actif: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Address', AddressSchema);