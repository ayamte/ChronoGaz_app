const mongoose = require('mongoose');    
    
const PhysicalUserSchema = new mongoose.Schema({        
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },        
  first_name: { type: String, required: true },        
  last_name: { type: String, required: true },        
  civilite: { type: String, enum: ['M', 'Mme', 'Mlle'], required: true },        
  date_naissance: Date,        
  telephone_principal: String,        
  adresse_principale: String,  
  ville: {       
    type: String,       
    enum: ['Casablanca'],  
    required: false      
  },  
  region_principale: {         
    type: String,         
    enum: ['2 Mars', 'Maarif', 'Bir Anzarane', 'Boulevard al qods'],  
    required: false        
  },        
  moral_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'MoralUser' },      
  actif: { type: Boolean, default: true },        
}, { timestamps: true });
    
PhysicalUserSchema.index({ user_id: 1 });    
// PhysicalUserSchema.index({ cin: 1 }); // Index supprimé car cin n'existe plus  
PhysicalUserSchema.index({ last_name: 1, first_name: 1 });    
    
module.exports = mongoose.model('PhysicalUser', PhysicalUserSchema);