const mongoose = require('mongoose');  
  
const EmployeSchema = new mongoose.Schema({  
  physical_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'PhysicalUser', required: true, unique: true },  
  matricule: { type: String, required: true, unique: true },  
  cnss: String,  
  fonction: { type: String, enum: ['CHAUFFEUR', 'ACCOMPAGNANT', 'MAGASINIER', 'MANAGER', 'COMMERCIAL'], required: true },  
  date_embauche: { type: Date, required: true },  
  date_sortie: Date,  
  salaire_base: Number,  
  actif: { type: Boolean, default: true },  
}, { timestamps: true });  
  
EmployeSchema.index({ matricule: 1 });  
EmployeSchema.index({ physical_user_id: 1 });  
EmployeSchema.index({ fonction: 1 });  
  
module.exports = mongoose.model('Employe', EmployeSchema);