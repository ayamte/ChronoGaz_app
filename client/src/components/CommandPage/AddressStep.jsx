import React from 'react';
import { MapPin } from 'lucide-react';

const AddressStep = ({ 
  useGPS, 
  setUseGPS, 
  address, 
  setAddress, 
  gpsLocation, 
  onGPSLocation, 
  onBack, 
  onNext, 
  canProceed 
}) => {


  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-center" style={{color: '#1F55A3'}}>
        2) Adresse de livraison
      </h2>

      <div className="space-y-6">
        {/* GPS Option */}
        <div className="border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              id="gps"
              name="addressType"
              checked={useGPS}
              onChange={() => setUseGPS(true)}
              className="w-4 h-4"
            />
            <label htmlFor="gps" className="flex items-center space-x-2 cursor-pointer">
              <MapPin size={20} style={{color: '#4DAEBD'}} />
              <span className="font-medium">Utiliser ma position actuelle</span>
            </label>
          </div>
          
          {useGPS && (
            <div className="mt-4">
              <button
                onClick={onGPSLocation}
                className="px-4 py-2 rounded-lg text-white font-medium hover:opacity-80 transition-opacity"
                style={{backgroundColor: '#4DAEBD'}}
              >
                <MapPin size={16} className="inline mr-2" />
                Obtenir ma position
              </button>
              {gpsLocation && (
                <p className="mt-2 text-sm text-green-600">
                  Position obtenue: {gpsLocation.latitude.toFixed(4)}, {gpsLocation.longitude.toFixed(4)}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Manual Address Option */}
        <div className="border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-4">
            <input
              type="radio"
              id="manual"
              name="addressType"
              checked={!useGPS}
              onChange={() => setUseGPS(false)}
              className="w-4 h-4"
            />
            <label htmlFor="manual" className="font-medium cursor-pointer">
              Saisir l'adresse manuellement
            </label>
          </div>
          
          {!useGPS && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Adresse complète *</label>
                <textarea
                  value={address.fullAddress}
                  onChange={(e) => setAddress({...address, fullAddress: e.target.value})}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  rows="3"
                  placeholder="Entrez votre adresse complète..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Téléphone *</label>
                <input
                  type="tel"
                  value={address.phone}
                  onChange={(e) => setAddress({...address, phone: e.target.value})}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Votre numéro de téléphone..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Instructions (optionnel)</label>
                <textarea
                  value={address.instructions}
                  onChange={(e) => setAddress({...address, instructions: e.target.value})}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  rows="2"
                  placeholder="Instructions spéciales pour la livraison..."
                />
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
          onClick={onNext}
          disabled={!canProceed}
          className={`px-8 py-3 rounded-lg font-bold text-white transition-all ${
            canProceed 
              ? 'hover:opacity-80 cursor-pointer' 
              : 'opacity-50 cursor-not-allowed'
          }`}
          style={{backgroundColor: canProceed ? '#1F55A3' : '#9ca3af'}}
        >
          Continuer vers le récapitulatif
        </button>
      </div>
    </div>
  );
};

export default AddressStep;
