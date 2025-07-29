import React, { useState } from 'react';
import Title from '../../components/client/CommandPage/Title';
import StepsIndicator from '../../components/client/CommandPage/StepsIndicator';
import QuantityStep from '../../components/client/CommandPage/QuantityStep';
import AddressStep from '../../components/client/CommandPage/AddressStep';
import SummaryStep from '../../components/client/CommandPage/SummaryStep';
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
        nom_long: 'Bouteille de Gaz Butane 12kg Afriquia - Gamme Économique',
        type_gaz: 'BUTANE',
        capacite: 12,
        marque: 'Afriquia',
        gamme: 'Économique',
        description: 'Bouteille de gaz butane de 12kg de la marque Afriquia. Idéale pour un usage domestique quotidien avec un excellent rapport qualité-prix. Parfaite pour la cuisine, le chauffage d\'appoint et l\'eau chaude.',
        image_url: butaButane,
        poids_vide: 15.5,
        poids_plein: 27.5,
        category_id: 1,
        actif: 1,
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-12-01T14:20:00Z'
      },
      {
        id: 2,
        reference: 'BUT-12KG-SHELL',
        nom_court: 'Butane 12kg Shell',
        nom_long: 'Bouteille de Gaz Butane 12kg Shell - Gamme Standard',
        type_gaz: 'BUTANE',
        capacite: 12,
        marque: 'Shell',
        gamme: 'Standard',
        description: 'Bouteille de gaz butane Shell 12kg, qualité standard fiable. Conçue pour répondre aux besoins énergétiques domestiques avec une combustion propre et efficace.',
        image_url: butaButane,
        poids_vide: 15.2,
        poids_plein: 27.2,
        category_id: 1,
        actif: 1,
        created_at: '2024-01-20T09:15:00Z',
        updated_at: '2024-11-28T16:45:00Z'
      },
      {
        id: 3,
        reference: 'BUT-12KG-TOTAL',
        nom_court: 'Butane 12kg Total',
        nom_long: 'Bouteille de Gaz Butane 12kg Total - Gamme Premium',
        type_gaz: 'BUTANE',
        capacite: 12,
        marque: 'Total',
        gamme: 'Premium',
        description: 'Bouteille de gaz butane premium Total 12kg. Qualité supérieure avec une pureté optimale du gaz pour une performance maximale. Recommandée pour les utilisateurs exigeants.',
        image_url: butaButane,
        poids_vide: 15.8,
        poids_plein: 27.8,
        category_id: 1,
        actif: 1,
        created_at: '2024-01-25T11:00:00Z',
        updated_at: '2024-12-02T13:30:00Z'
      },
    
      // Propane 34 kg
      {
        id: 4,
        reference: 'PROP-34KG-AFRIQUIA',
        nom_court: 'Propane 34kg Afriquia',
        nom_long: 'Bouteille de Gaz Propane 34kg Afriquia - Usage Professionnel',
        type_gaz: 'PROPANE',
        capacite: 34,
        marque: 'Afriquia',
        gamme: 'Économique',
        description: 'Grande bouteille de propane 34kg Afriquia, parfaite pour les besoins professionnels et industriels. Résistance aux basses températures et performance constante.',
        image_url: butaPropane,
        poids_vide: 28.5,
        poids_plein: 62.5,
        category_id: 2,
        actif: 1,
        created_at: '2024-02-01T08:45:00Z',
        updated_at: '2024-11-30T10:15:00Z'
      },
      {
        id: 5,
        reference: 'PROP-34KG-SHELL',
        nom_court: 'Propane 34kg Shell',
        nom_long: 'Bouteille de Gaz Propane 34kg Shell - Qualité Industrielle',
        type_gaz: 'PROPANE',
        capacite: 34,
        marque: 'Shell',
        gamme: 'Standard',
        description: 'Bouteille de propane Shell 34kg pour usage industriel et commercial. Conçue pour les applications nécessitant une grande quantité de gaz avec une fiabilité éprouvée.',
        image_url: butaPropane,
        poids_vide: 28.2,
        poids_plein: 62.2,
        category_id: 2,
        actif: 0, // Pas disponible
        created_at: '2024-02-05T14:20:00Z',
        updated_at: '2024-12-01T09:00:00Z'
      },
      {
        id: 6,
        reference: 'PROP-34KG-TOTAL',
        nom_court: 'Propane 34kg Total',
        nom_long: 'Bouteille de Gaz Propane 34kg Total - Excellence Professionnelle',
        type_gaz: 'PROPANE',
        capacite: 34,
        marque: 'Total',
        gamme: 'Premium',
        description: 'Bouteille de propane Total 34kg haut de gamme. Qualité premium pour les professionnels exigeants. Pureté maximale et performance exceptionnelle dans toutes les conditions.',
        image_url: butaPropane,
        poids_vide: 29.0,
        poids_plein: 63.0,
        category_id: 2,
        actif: 1,
        created_at: '2024-02-10T16:30:00Z',
        updated_at: '2024-12-02T15:45:00Z'
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
