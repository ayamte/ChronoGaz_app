import React, { useState } from 'react';
import { MapPin, Phone, Home, Building } from 'lucide-react';
import { createOrderFromSteps } from '../../../services/orderService';

const SummaryStep = ({ orderData, onBack, onConfirm }) => {
  const { products, quantities, prices, deliveryFee, subtotal, total } = orderData;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirm = async () => {
    setLoading(true);
    setSuccess(false);
    setError(null);
    
    try {
      await onConfirm();
      setSuccess(true);
    } catch (err) {
      console.error('❌ Erreur création commande:', err);
      setError("Une erreur est survenue lors de la création de la commande.");
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address) => {
    const parts = [];
    if (address.num_appt) parts.push(`Appt ${address.num_appt}`);
    if (address.num_immeuble) parts.push(`Imm ${address.num_immeuble}`);
    if (address.rue) parts.push(address.rue);
    if (address.quartier) parts.push(address.quartier);
    if (address.ville) parts.push(address.ville);
    if (address.code_postal) parts.push(address.code_postal);
    return parts.join(', ');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Résumé de la commande</h2>
      
      <div className="space-y-6">
        {/* Produits commandés */}
        <div>
          <h3 className="font-bold mb-4 text-lg text-gray-800">Produits commandés:</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            {products.filter(product => quantities[product.id] > 0).map(product => (
              <div key={product.id} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                <span className="font-medium text-gray-700">
                  {product.marque} {product.capacite}kg ({product.type_gaz})
                </span>
                <div className="text-right">
                  <span className="font-medium text-gray-900">
                    {quantities[product.id]} × {prices[product.id]} DH = {quantities[product.id] * prices[product.id]} DH
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totaux */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex justify-between py-2 text-gray-700">
            <span>Sous-total:</span>
            <span className="font-medium">{subtotal} DH</span>
          </div>
          <div className="flex justify-between py-2 text-gray-700">
            <span>Frais de livraison:</span>
            <span className="font-medium">{deliveryFee} DH</span>
          </div>
          <div className="flex justify-between py-3 text-xl font-bold border-t border-blue-200 text-blue-900">
            <span>Total:</span>
            <span>{total} DH</span>
          </div>
        </div>

        {/* Adresse de livraison */}
        <div>
          <h3 className="font-bold mb-3 text-lg text-gray-800 flex items-center">
            <MapPin size={20} className="mr-2 text-blue-600" />
            Adresse de livraison:
          </h3>
          
          {orderData.useGPS || (orderData.address?.latitude && orderData.address?.longitude) ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center text-green-700">
                <MapPin size={16} className="mr-2" />
                <span className="font-medium">Position sur la carte</span>
              </div>
              { (orderData.useGPS && orderData.gpsLocation) || (orderData.address?.latitude && orderData.address?.longitude) ? (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        {/* ... */}
        <p className="text-gray-600 mt-1">
            Coordonnées: {orderData.useGPS 
                ? Number(orderData.gpsLocation.latitude).toFixed(4) 
                : Number(orderData.address.latitude).toFixed(4)}, 
                {orderData.useGPS 
                ? Number(orderData.gpsLocation.longitude).toFixed(4) 
                : Number(orderData.address.longitude).toFixed(4)}
        </p>
        {/* ... */}
    </div>
) : (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        {/* ... */}
    </div>
)}
              {orderData.address?.telephone && (
                <div className="flex items-center mt-2 text-gray-600">
                  <Phone size={16} className="mr-2" />
                  <span>{orderData.address.telephone}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              {orderData.address?.region_id && (
                <div className="flex items-center text-blue-600 mb-2">
                  <Building size={16} className="mr-2" />
                  <span className="font-medium">
                    Région: {orderData.address?.region?.nom || 'Région sélectionnée'}
                  </span>
                </div>
              )}
              <div className="flex items-start text-gray-700 mb-2">
                <Home size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">{formatAddress(orderData.address)}</p>
                </div>
              </div>
              {orderData.address?.telephone && (
                <div className="flex items-center text-gray-600 mb-2">
                  <Phone size={16} className="mr-2" />
                  <span>{orderData.address.telephone}</span>
                </div>
              )}
              {orderData.address?.instructions_livraison && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-800">
                    <span className="font-medium">Instructions: </span>
                    {orderData.address.instructions_livraison}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Messages d'état */}
        {loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-600 flex items-center">
              <span className="animate-spin mr-2">⏳</span>
              Création de la commande en cours...
            </p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-600 flex items-center">
              <span className="mr-2">✅</span>
              Commande créée avec succès !
            </p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 flex items-center">
              <span className="mr-2">❌</span>
              {error}
            </p>
          </div>
        )}
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          disabled={loading}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Retour
        </button>
        
        <button
          onClick={handleConfirm}
          disabled={loading || success}
          className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Confirmation...' : success ? 'Commande confirmée' : 'Confirmer la commande'}
        </button>
      </div>
    </div>
  );
};

export default SummaryStep;