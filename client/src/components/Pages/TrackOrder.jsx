import React from "react";
import { useState, useEffect } from "react";
import Title from "../TrackOrderPage/Title";
import OrderStatusCard from "../TrackOrderPage/OrderStatusCard";
import OrderProgress from "../TrackOrderPage/OrderProgress";
import DeliveryDriverInfo from "../TrackOrderPage/DeliveryDriverInfo";
import InteractiveMap from "../TrackOrderPage/InteractiveMap";
import OrderSummary from "../TrackOrderPage/OrderSummary";
import { use } from "react";

const TrackOrder = () => {
  const [orderStatus, setOrderStatus] = useState(2);
  const [deliveryPosition, setDeliveryPosition] = useState({
    lat: 33.5731,
    lng: -7.5898
  });
  const [destinationPosition, setDestinationPosition] = useState({
    lat: 33.5831,
    lng: -7.5798
  });
  const [manualAddress, setManualAddress] = useState("");
  

  // Position de destination (votre adresse)
  useEffect(() => {
    const savedOrder = JSON.parse(localStorage.getItem('lastOrder'));
    if (savedOrder){
      if (savedOrder.useGPS && savedOrder.gpsLocation){
        setDestinationPosition({
          lat: savedOrder.gpsLocation.latitude,
          lng: savedOrder.gpsLocation.longitude
        });
      } else if (!savedOrder.useGPS) {
        setManualAddress(savedOrder.address.fullAddress);
      }
    }
  }, []);
  

  // Simuler le mouvement du livreur vers la destination
  // logique a modifier
  useEffect(() => {
    const interval = setInterval(() => {
      setDeliveryPosition(prev => {
        // Calculer un mouvement progressif vers la destination
        const latDiff = destinationPosition.lat - prev.lat;
        const lngDiff = destinationPosition.lng - prev.lng;
        const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
        
        if (distance > 0.001) {
          return {
            lat: prev.lat + (latDiff * 0.05) + (Math.random() - 0.5) * 0.0005,
            lng: prev.lng + (lngDiff * 0.05) + (Math.random() - 0.5) * 0.0005
          };
        }
        return prev;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Données
  const orderNumber = "GAZ-2024-001234";
  
  const statusSteps = [
    { 
      id: 0, 
      title: "Commande confirmée", 
      iconType: "check", 
      time: "14:30",
      description: "Votre commande a été confirmée"
    },
    { 
      id: 1, 
      title: "Préparation terminée", 
      iconType: "package", 
      time: "15:15",
      description: "Votre commande est prête"
    },
    { 
      id: 2, 
      title: "En route", 
      iconType: "truck", 
      time: "15:45",
      description: "Le livreur est en route vers vous"
    },
    { 
      id: 3, 
      title: "Livraison", 
      iconType: "mappin", 
      time: "16:30 (estimé)",
      description: "Livraison en cours"
    }
  ];

  const deliveryDriver = {
    name: "Ahmed Benali",
    phone: "+212 6 12 34 56 78",
    vehicle: "Camionnette - ABC 1234"
  };

 

  const getStatusDescription = () => {
    switch(orderStatus) {
      case 0: return "Votre commande a été confirmée avec succès";
      case 1: return "Votre commande est en cours de préparation";
      case 2: return "Votre commande est en route vers vous";
      case 3: return "Le livreur est arrivé à destination";
      default: return "Suivi de votre commande";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Title title="Suivre ma Commande" />

      <div className="max-w-4xl mx-auto p-6">
        <OrderStatusCard 
          orderNumber={orderNumber}
          statusDescription={getStatusDescription()}
          estimatedTime="16:30"
        />

        <OrderProgress 
          orderStatus={orderStatus}
          statusSteps={statusSteps}
        />

        <DeliveryDriverInfo 
          driver={deliveryDriver}
          isVisible={orderStatus >= 2}
        />

        <InteractiveMap 
          deliveryPosition={deliveryPosition}
          driverName={deliveryDriver.name}
          isVisible={orderStatus >= 2}
          destinationPosition={destinationPosition}
        />

        <OrderSummary />
      </div>
    </div>
  );
};

  
  export default TrackOrder;