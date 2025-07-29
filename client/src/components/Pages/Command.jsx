import React, { useState } from 'react';
import Title from '../CommandPage/Title';
import StepsIndicator from '../CommandPage/StepsIndicator';
import QuantityStep from '../CommandPage/QuantityStep';
import AddressStep from '../CommandPage/AddressStep';
import SummaryStep from '../CommandPage/SummaryStep';
import butaButane from '../../assets/svg/buta-gaz-butane.svg';
import butaPropane from '../../assets/svg/buta-gaz-propane.svg';

const Command = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [quantities, setQuantities] = useState({});
  const [useGPS, setUseGPS] = useState(false);
  const [address, setAddress] = useState({
    fullAddress: 'immeuble 122, Apartement 12',
    phone: '0674563411',
    instructions: ''
  });
  const [gpsLocation, setGpsLocation] = useState(null);

  // Produits disponibles (normalement depuis votre API)
  const products = [
    // Butane 12 kg
  {
    id: 1,
    reference: 'BUT-12KG-AFRIQUIA',
    nom_court: 'Butane 12kg Afriquia',
    type_gaz: 'BUTANE',
    capacite: 12,
    marque: 'Afriquia',
    gamme: 'Économique',
    image_url: butaButane,
    actif: 1
  },
  {
    id: 2,
    reference: 'BUT-12KG-SHELL',
    nom_court: 'Butane 12kg Shell',
    type_gaz: 'BUTANE',
    capacite: 12,
    marque: 'Shell',
    gamme: 'Standard',
    image_url: butaButane,
    actif: 1
  },
  {
    id: 3,
    reference: 'BUT-12KG-TOTAL',
    nom_court: 'Butane 12kg Total',
    type_gaz: 'BUTANE',
    capacite: 12,
    marque: 'Total',
    gamme: 'Premium',
    image_url: butaButane,
    actif: 1
  },

  // Propane 34 kg
  {
    id: 4,
    reference: 'PROP-34KG-AFRIQUIA',
    nom_court: 'Propane 34kg Afriquia',
    type_gaz: 'PROPANE',
    capacite: 34,
    marque: 'Afriquia',
    gamme: 'Économique',
    image_url: butaPropane,
    actif: 1
  },
  {
    id: 5,
    reference: 'PROP-34KG-SHELL',
    nom_court: 'Propane 34kg Shell',
    type_gaz: 'PROPANE',
    capacite: 34,
    marque: 'Shell',
    gamme: 'Standard',
    image_url: butaPropane,
    actif: 0
  },
  {
    id: 6,
    reference: 'PROP-34KG-TOTAL',
    nom_court: 'Propane 34kg Total',
    type_gaz: 'PROPANE',
    capacite: 34,
    marque: 'Total',
    gamme: 'Premium',
    image_url: butaPropane,
    actif: 1
  }
  ];

  const prices = {
    1: 120,  // Butane 12kg Afriquia (Économique)
    2: 130,  // Butane 12kg Shell (Standard)
    3: 140,  // Butane 12kg Total (Premium)
    4: 350,  // Propane 34kg Afriquia (Économique)
    5: 370,  // Propane 34kg Shell (Standard)
    6: 390   // Propane 34kg Total (Premium)
  };

  const deliveryFee = 20;

  const handleQuantityChange = (productId, operation) => {
    const product = products.find(p => p.id === productId);
    if(!product) return;

    if (operation === 'increment' && product.actif !== 1){
      alert('Impossible d\'ajouter un produit non disponible');
      return;
    }
    setQuantities(prev => ({
      ...prev,
      [productId]: operation === 'increment'
        ? (prev[productId] || 0) + 1
        : Math.max(0, (prev[productId] || 0) - 1)
    }));
  };

  const handleGPSLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setUseGPS(true);
        },
        (error) => {
          alert('Erreur lors de la géolocalisation');
        }
      );
    } else {
      alert('La géolocalisation n\'est pas supportée par ce navigateur');
    }
  };

  const canProceedToStep2 = Object.values(quantities).some(qty => qty > 0);
  const canProceedToStep3 = useGPS ? gpsLocation : address.fullAddress && address.phone;

  const subtotal = Object.entries(quantities).reduce((total, [productId, qty]) => {
    return total + (qty * (prices[productId] || 0));
  }, 0);
  const total = subtotal + deliveryFee;

  const handleConfirmOrder = () => {
    // Garde votre logique originale
    const orderData = {
      products,
      quantities,
      prices,
      deliveryFee,
      subtotal,
      total,
      useGPS,
      address,
      gpsLocation
    };
    
    localStorage.setItem('lastOrder', JSON.stringify(orderData));
    alert('Commande confirmée avec succès !');
    window.location.href = "/TrackOrder";
  };

  const orderData = {
    products,
    quantities,
    prices,
    deliveryFee,
    subtotal,
    total,
    useGPS,
    address,
    gpsLocation
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Title />
      <StepsIndicator currentStep={currentStep} />
      <div className="max-w-4xl mx-auto p-6">
        {currentStep === 1 && (
          <QuantityStep
            products={products}
            quantities={quantities}
            prices={prices}
            onQuantityChange={handleQuantityChange}
            onNext={() => setCurrentStep(2)}
            canProceed={canProceedToStep2}
          />
        )}
        {currentStep === 2 && (
          <AddressStep
            useGPS={useGPS}
            setUseGPS={setUseGPS}
            address={address}
            setAddress={setAddress}
            gpsLocation={gpsLocation}
            onGPSLocation={handleGPSLocation}
            onBack={() => setCurrentStep(1)}
            onNext={() => setCurrentStep(3)}
            canProceed={canProceedToStep3}
          />
        )}
        {currentStep === 3 && (
          <SummaryStep
            orderData={orderData}
            onBack={() => setCurrentStep(2)}
            onConfirm={handleConfirmOrder}
          />
        )}
      </div>
    </div>
  );
};


export default Command;
