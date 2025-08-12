const mongoose = require('mongoose');    
    
const PhysicalUserSchema = new mongoose.Schema({        
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },        
  first_name: { type: String, required: true },        
  last_name: { type: String, required: true },        
  civilite: { type: String, enum: ['M', 'Mme', 'Mlle'], required: true },        
  date_naissance: Date,        
  telephone_principal: String,        
  adresse_principale: String,  
  region_principale: {   
    type: mongoose.Schema.Types.ObjectId,   
    ref: 'Region',  
    required: false   
  },  
  city_id: {  
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'City',   
    required: false  
},      
  moral_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'MoralUser' },  
}, { timestamps: true });
    
PhysicalUserSchema.index({ user_id: 1 });    
// PhysicalUserSchema.index({ cin: 1 }); // Index supprimé car cin n'existe plus  
PhysicalUserSchema.index({ last_name: 1, first_name: 1 });    
    
module.exports = mongoose.model('PhysicalUser', PhysicalUserSchema);