import React, { useState } from 'react';
import Title from '../CommandPage/Title';
import StepsIndicator from '../CommandPage/StepsIndicator';
import QuantityStep from '../CommandPage/QuantityStep';
import AddressStep from '../CommandPage/AddressStep';
import SummaryStep from '../CommandPage/SummaryStep';

const Command = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [propaneQuantity, setPropaneQuantity] = useState(0);
  const [butaneQuantity, setButaneQuantity] = useState(0);
  const [useGPS, setUseGPS] = useState(false);
  const [address, setAddress] = useState({
    fullAddress: '',
    phone: '',
    instructions: ''
  });
  const [gpsLocation, setGpsLocation] = useState(null);

  const propanePrice = 100;
  const butanePrice = 50;
  const deliveryFee = 20;

  const handleQuantityChange = (type, operation) => {
    if (type === 'propane') {
      if (operation === 'increment') {
        setPropaneQuantity(prev => prev + 1);
      } else if (operation === 'decrement' && propaneQuantity > 0) {
        setPropaneQuantity(prev => prev - 1);
      }
    } else if (type === 'butane') {
      if (operation === 'increment') {
        setButaneQuantity(prev => prev + 1);
      } else if (operation === 'decrement' && butaneQuantity > 0) {
        setButaneQuantity(prev => prev - 1);
      }
    }
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

  const canProceedToStep2 = propaneQuantity > 0 || butaneQuantity > 0;
  const canProceedToStep3 = useGPS ? gpsLocation : address.fullAddress && address.phone;

  const subtotal = (propaneQuantity * propanePrice) + (butaneQuantity * butanePrice);
  const total = subtotal + deliveryFee;

  const handleConfirmOrder = () => {
    
    localStorage.setItem('lastOrder', JSON.stringify(orderData));
    alert('Commande confirmée avec succès !');

    window.location.href = "/TrackOrder";
  };

  const orderData = {
    propaneQuantity,
    butaneQuantity,
    propanePrice,
    butanePrice,
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
            propaneQuantity={propaneQuantity}
            butaneQuantity={butaneQuantity}
            propanePrice={propanePrice}
            butanePrice={butanePrice}
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
