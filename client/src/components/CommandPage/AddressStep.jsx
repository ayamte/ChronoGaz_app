import React, { useState } from 'react';
import { MapPin, Map } from 'lucide-react';

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
  const [selectedRegion, setSelectedRegion] = useState('');
  const [showRegions, setShowRegions] = useState(false);

  const regions = [
    {
      id: 'mars',
      name: '2 Mars',
      color: '#FF6B6B',
      description: 'Quartier résidentiel au centre-ville.',
      zone_geographique: 'POLYGON((0 0, 0 1, 1 1, 1 0, 0 0))',
      actif: 1,
      created_at: '2025-07-29T10:00:00Z',
      updated_at: '2025-07-29T10:00:00Z'
    },
    {
      id: 'maarif',
      name: 'Maarif',
      color: '#4ECDC4',
      description: 'Quartier commerçant très fréquenté.',
      zone_geographique: 'POLYGON((1 1, 1 2, 2 2, 2 1, 1 1))',
      actif: 1,
      created_at: '2025-07-29T10:00:00Z',
      updated_at: '2025-07-29T10:00:00Z'
    },
    {
      id: 'biranzerane',
      name: 'Bir Anzarane',
      color: '#45B7D1',
      description: 'Zone longeant le boulevard Bir Anzarane.',
      zone_geographique: 'POLYGON((2 2, 2 3, 3 3, 3 2, 2 2))',
      actif: 1,
      created_at: '2025-07-29T10:00:00Z',
      updated_at: '2025-07-29T10:00:00Z'
    },
    {
      id: 'alqods',
      name: 'Al Qods',
      color: '#96CEB4',
      description: 'Quartier résidentiel populaire.',
      zone_geographique: 'POLYGON((3 3, 3 4, 4 4, 4 3, 3 3))',
      actif: 1,
      created_at: '2025-07-29T10:00:00Z',
      updated_at: '2025-07-29T10:00:00Z'
    }
  ];
  ;

  const handleRegionSelect = (regionId) => {
    setSelectedRegion(regionId);
    const region = regions.find(r => r.id === regionId);
    setAddress({...address, region: region.name});
  };

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
              onChange={() => {
                setUseGPS(false);
                setShowRegions(false);
              }}
              className="w-4 h-4"
            />
            <label htmlFor="manual" className="font-medium cursor-pointer">
              Saisir l'adresse manuellement
            </label>
          </div>
          
          {!useGPS && (
            <div className="space-y-4">
              {/* Region Selection */}
              <div className="mb-4">
                <button
                  onClick={() => setShowRegions(!showRegions)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Map size={16} style={{color: '#4DAEBD'}} />
                  <span className="text-sm font-medium">Choisir une région</span>
                </button>
                
                {showRegions && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {regions.map((region) => (
                      <div
                        key={region.id}
                        onClick={() => {
                          handleRegionSelect(region.id);
                          setShowRegions(false);
                        }}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          selectedRegion === region.id
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{backgroundColor: region.color}}
                          ></div>
                          <span className={`text-sm font-medium ${
                            selectedRegion === region.id ? 'text-blue-600' : 'text-gray-700'
                          }`}>
                            {region.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {selectedRegion && (
                  <p className="mt-2 text-sm text-blue-600">
                    Région sélectionnée: {regions.find(r => r.id === selectedRegion)?.name}
                  </p>
                )}
              </div>

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