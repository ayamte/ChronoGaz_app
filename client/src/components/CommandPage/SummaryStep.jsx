import React from 'react';
import { MapPin, Phone } from 'lucide-react';

const SummaryStep = ({ orderData, onBack, onConfirm }) => {
  const { 
    propaneQuantity, 
    butaneQuantity, 
    propanePrice, 
    butanePrice, 
    deliveryFee, 
    total, 
    useGPS, 
    address, 
    gpsLocation 
  } = orderData;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-center" style={{color: '#1F55A3'}}>
        3) Récapitulatif de la commande
      </h2>

      <div className="space-y-4">
        {/* Order Items */}
        <div className="border-2 border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-bold mb-4" style={{color: '#245FA6'}}>Articles commandés</h3>
          
          {propaneQuantity > 0 && (
            <div className="flex justify-between items-center py-2 border-b">
              <div>
                <span className="font-medium">Bouteille Propane 34kg</span>
                <span className="text-gray-600 ml-2">x {propaneQuantity}</span>
              </div>
              <div className="text-right">
                <div className="font-bold">{propaneQuantity * propanePrice} DH</div>
                <div className="text-sm text-gray-600">{propanePrice} DH/unité</div>
              </div>
            </div>
          )}
          
          {butaneQuantity > 0 && (
            <div className="flex justify-between items-center py-2 border-b">
              <div>
                <span className="font-medium">Bouteille Butane 12kg</span>
                <span className="text-gray-600 ml-2">x {butaneQuantity}</span>
              </div>
              <div className="text-right">
                <div className="font-bold">{butaneQuantity * butanePrice} DH</div>
                <div className="text-sm text-gray-600">{butanePrice} DH/unité</div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center py-2 border-b">
            <span className="font-medium">Frais de livraison</span>
            <span className="font-bold">{deliveryFee} DH</span>
          </div>

          <div className="flex justify-between items-center py-3 text-xl font-bold" style={{color: '#1F55A3'}}>
            <span>Total</span>
            <span>{total} DH</span>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="border-2 border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-bold mb-4" style={{color: '#245FA6'}}>Adresse de livraison</h3>
          {useGPS && gpsLocation ? (
            <div className="flex items-center space-x-2">
              <MapPin size={20} style={{color: '#4DAEBD'}} />
              <span>Position GPS: {gpsLocation.latitude.toFixed(4)}, {gpsLocation.longitude.toFixed(4)}</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <MapPin size={20} style={{color: '#4DAEBD'}} className="mt-1" />
                <div>
                  <p>{address.fullAddress}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Phone size={16} style={{color: '#4DAEBD'}} />
                    <span className="text-sm">{address.phone}</span>
                  </div>
                  {address.instructions && (
                    <p className="text-sm text-gray-600 mt-1">
                      Instructions: {address.instructions}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-lg font-bold text-white hover:opacity-80 transition-opacity"
          style={{backgroundColor: '#4DAEBD'}}
        >
          Retour
        </button>
        
        <button
          onClick={onConfirm}
          className="px-8 py-3 rounded-lg font-bold text-white hover:opacity-80 transition-opacity text-lg"
          style={{backgroundColor: '#1F55A3'}}
        >
          Confirmer la commande
        </button>
      </div>
    </div>
  );
};

export default SummaryStep;