import React, { useState, useEffect } from 'react';
import { MapPin, Map } from 'lucide-react';
import axios from 'axios';

const AddressStep = ({ 
  useGPS, 
  setUseGPS, 
  address, 
  setAddress, 
  gpsLocation, 
  onGPSLocation, 
  onBack, 
  onNext, 
  canProceed ,
  clientAddresses = [],
  loadingClient = false
}) => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [showRegions, setShowRegions] = useState(false);
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/regions');
        setRegions(res.data);
      } catch (error) {
        console.error('Erreur lors du chargement des régions:', error);
      }
    };
  
    fetchRegions();
  }, []);

  const handleRegionSelect = (regionId) => {
    const selectedRegion = regions.find(r => r._id === regionId);
    setSelectedRegion(regionId);
    setAddress({ ...address, region_id: regionId, region: selectedRegion });
  };

  const handleAddressChange = (field, value) => {
    setAddress({ ...address, [field]: value });
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

        {/* Adresses sauvegardées */}
        {!useGPS && clientAddresses.length > 0 && (
  <div className="border-2 border-gray-200 rounded-lg p-4 mb-4">
    <h4 className="font-medium mb-3 text-gray-700">
      Vos adresses sauvegardées ({clientAddresses.length}) :
    </h4>
    <div className="space-y-2">
      {clientAddresses.map((addr) => (
        <div
          key={addr._id}
          onClick={() => {
            setAddress({
              ...address,
              num_appt: addr.num_appt || '',
              num_immeuble: addr.num_immeuble || '',
              rue: addr.rue || '',
              quartier: addr.quartier || '',
              ville: addr.ville || 'Casablanca',
              code_postal: addr.code_postal || '',
              region_id: addr.region_id || '',
              telephone: addr.telephone || '',
              instructions_livraison: addr.instructions_livraison || ''
            });
            setSelectedRegion(addr.region_id || '');
          }}
          className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-800">{addr.type_adresse}</p>
                {addr.is_principal && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                    Principal
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {addr.num_immeuble ? `Imm. ${addr.num_immeuble}, ` : ''}
                {addr.num_appt ? `Apt. ${addr.num_appt}, ` : ''}
                {addr.rue}
              </p>
              <p className="text-sm text-gray-500">
                {addr.quartier ? `${addr.quartier}, ` : ''}{addr.ville}
              </p>
              {addr.telephone && (
                <p className="text-sm text-gray-500">Tel: {addr.telephone}</p>
              )}
            </div>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
              Utiliser
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

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
                  <span className="text-sm font-medium">Choisir une région *</span>
                </button>
                
                {showRegions && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {regions.map((region) => (
                      <div
                        key={region._id}
                        onClick={() => {
                          handleRegionSelect(region._id);
                          setShowRegions(false);
                        }}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          selectedRegion === region._id
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${
                            selectedRegion === region._id ? 'text-blue-600' : 'text-gray-700'
                          }`}>
                            {region.nom}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {selectedRegion && (
                  <p className="mt-2 text-sm text-blue-600">
                    Région sélectionnée: {regions.find(r => r._id === selectedRegion)?.nom}
                  </p>
                )}
              </div>

              {/* Address Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">N° Appartement</label>
                  <input
                    type="text"
                    value={address.num_appt || ''}
                    onChange={(e) => handleAddressChange('num_appt', e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="N° appartement..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">N° Immeuble</label>
                  <input
                    type="text"
                    value={address.num_immeuble || ''}
                    onChange={(e) => handleAddressChange('num_immeuble', e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="N° immeuble..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Rue *</label>
                <input
                  type="text"
                  value={address.rue || ''}
                  onChange={(e) => handleAddressChange('rue', e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Nom de la rue..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Quartier</label>
                  <input
                    type="text"
                    value={address.quartier || ''}
                    onChange={(e) => handleAddressChange('quartier', e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Quartier..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Ville *</label>
                  <input
                    type="text"
                    value={address.ville || 'Casablanca'}
                    onChange={(e) => handleAddressChange('ville', e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Ville..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Code Postal</label>
                <input
                  type="text"
                  value={address.code_postal || ''}
                  onChange={(e) => handleAddressChange('code_postal', e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Code postal..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Téléphone *</label>
                <input
                  type="tel"
                  value={address.telephone || ''}
                  onChange={(e) => handleAddressChange('telephone', e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Votre numéro de téléphone..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Instructions de livraison (optionnel)</label>
                <textarea
                  value={address.instructions_livraison || ''}
                  onChange={(e) => handleAddressChange('instructions_livraison', e.target.value)}
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