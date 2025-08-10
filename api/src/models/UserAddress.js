// models/UserAddress.js
const mongoose = require('mongoose');

const UserAddressSchema = new mongoose.Schema({
  physical_user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'PhysicalUser', 
    required: true 
  },
  address_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Address', 
    required: true 
  },
  is_principal: { 
    type: Boolean, 
    default: false 
  }
}, { 
  timestamps: true 
});

// Index pour améliorer les performances
UserAddressSchema.index({ physical_user_id: 1 });
UserAddressSchema.index({ address_id: 1 });
UserAddressSchema.index({ physical_user_id: 1, is_principal: 1 });

// S'assurer qu'un utilisateur n'a qu'une seule adresse principale
UserAddressSchema.pre('save', async function(next) {
  if (this.is_principal) {
    // Retirer le statut principal des autres adresses de cet utilisateur
    await this.constructor.updateMany(
      { 
        physical_user_id: this.physical_user_id, 
        _id: { $ne: this._id } 
      },
      { $set: { is_principal: false } }
    );
  }
  next();
});

module.exports = mongoose.model('UserAddress', UserAddressSchema);