const mongoose = require('mongoose');

const RegionSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  nom: { type: String, required: true },
  description: String,
  zone_geographique: { type: mongoose.Schema.Types.Mixed },
  actif: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Region', RegionSchema);