import React from "react";
import { useEffect, useRef, useCallback, useState } from "react";

const InteractiveMap = ({ deliveryPosition, driverName, isVisible, destinationPosition }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const destinationMarkerRef = useRef(null);
  const routePolylineRef = useRef(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [distanceKm, setDistanceKm] = useState(null);
  const [durationMin, setDurationMin] = useState(null);

  // Déplacer la fonction fetchAndDrawRoute au niveau du composant
  const fetchAndDrawRoute = useCallback(async (start, end) => {
    if (!mapInstanceRef.current || !window.L) return;
    
    const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.code === "Ok" && data.routes && data.routes[0]) {
        const distanceKm = (data.routes[0].distance / 1000).toFixed(2);
        const durationMin = (data.routes[0].duration / 60).toFixed(2);

        setDistanceKm(distanceKm);
        setDurationMin(durationMin);

        const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);

        // Supprime l'ancienne ligne si elle existe
        if (routePolylineRef.current && mapInstanceRef.current) {
          mapInstanceRef.current.removeLayer(routePolylineRef.current);
        }

        // Ajoute la nouvelle ligne
        routePolylineRef.current = window.L.polyline(coords, {
          color: '#4DAEBD',
          weight: 4,
          opacity: 0.9
        }).addTo(mapInstanceRef.current);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération de l'itinéraire :", err);
    }
  }, []);

  // Charger Leaflet
  useEffect(() => {
    const loadLeaflet = async () => {
      // Charger CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const leafletCSS = document.createElement('link');
        leafletCSS.rel = 'stylesheet';
        leafletCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.min.css';
        document.head.appendChild(leafletCSS);
      }

      // Charger JS
      if (!window.L) {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.min.js';
          script.onload = () => {
            setLeafletLoaded(true);
            resolve();
          };
          script.onerror = (error) => {
            console.error('Erreur lors du chargement de Leaflet:', error);
            reject(error);
          };
          document.head.appendChild(script);
        });
      } else {
        setLeafletLoaded(true);
        return Promise.resolve();
      }
    };

    loadLeaflet().catch(console.error);

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.error('Erreur lors de la suppression de la carte:', e);
        }
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Initialiser la carte quand Leaflet est chargé
  useEffect(() => {
    if (leafletLoaded && isVisible && mapRef.current && !mapInstanceRef.current) {
      initializeMap();
    }
  }, [leafletLoaded, isVisible]);

  const initializeMap = useCallback(() => {
    if (!window.L || mapInstanceRef.current || !mapRef.current) return;

    try {
      // Initialiser la carte
      mapInstanceRef.current = window.L.map(mapRef.current, {
        center: [deliveryPosition.lat, deliveryPosition.lng],
        zoom: 13,
        zoomControl: true
      });

      // Ajouter les tuiles de carte
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      // Icône personnalisée pour le livreur
      const driverIcon = window.L.divIcon({
        html: `
          <div style="
            background-color: #4DAEBD; 
            border-radius: 50%; 
            width: 30px; 
            height: 30px; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            border: 3px solid white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z"/>
            </svg>
          </div>
        `,
        className: 'driver-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      // Icône pour la destination
      const destinationIcon = window.L.divIcon({
        html: `
          <div style="
            background-color: #1F55A3; 
            border-radius: 50%; 
            width: 25px; 
            height: 25px; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            border: 3px solid white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          ">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </div>
        `,
        className: 'destination-marker',
        iconSize: [25, 25],
        iconAnchor: [12.5, 12.5]
      });

      // Ajouter le marqueur du livreur
      driverMarkerRef.current = window.L.marker([deliveryPosition.lat, deliveryPosition.lng], {
        icon: driverIcon
      }).addTo(mapInstanceRef.current)
        .bindPopup(`<b>${driverName}</b><br>Position actuelle du livreur`);

      // Ajouter le marqueur de destination
      destinationMarkerRef.current = window.L.marker([destinationPosition.lat, destinationPosition.lng], {
        icon: destinationIcon
      }).addTo(mapInstanceRef.current)
        .bindPopup('<b>Votre adresse</b><br>Destination de livraison');

      // Tracer la route initiale
      setTimeout(() => {
        fetchAndDrawRoute(deliveryPosition, destinationPosition);
      }, 100);

      // Ajuster la vue pour inclure tous les marqueurs
      const group = new window.L.featureGroup([driverMarkerRef.current, destinationMarkerRef.current]);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la carte:', error);
    }
  }, [deliveryPosition, destinationPosition, driverName, fetchAndDrawRoute]);

  // Mettre à jour la position du livreur
  useEffect(() => {
    if (mapInstanceRef.current && driverMarkerRef.current && window.L && leafletLoaded) {
      try {
        const newLatLng = [deliveryPosition.lat, deliveryPosition.lng];
        driverMarkerRef.current.setLatLng(newLatLng);

        if (destinationMarkerRef.current) {
          destinationMarkerRef.current.setLatLng([destinationPosition.lat, destinationPosition.lng]);
        }

        // Mise à jour de la ligne avec un délai pour éviter les erreurs
        setTimeout(() => {
          fetchAndDrawRoute(deliveryPosition, destinationPosition);
        }, 100);
      } catch (error) {
        console.error('Erreur lors de la mise à jour des positions:', error);
      }
    }
  }, [deliveryPosition, destinationPosition, fetchAndDrawRoute, leafletLoaded]);

  if (!isVisible) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4" style={{color: '#245FA6'}}>
        Localisation en temps réel
      </h3>
      
      <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
        {/* Container de la carte */}
        <div 
          ref={mapRef}
          className="w-full h-96"
          style={{ minHeight: '400px', position: 'relative', zIndex: 0 }}
        />
        
        {/* Footer de la carte */}
        <div className="bg-gray-50 px-4 py-3 border-t">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{backgroundColor: '#4DAEBD'}}></div>
              <span className="text-gray-600">
                {leafletLoaded ? 'Position mise à jour en temps réel' : 'Chargement de la carte...'}
              </span>
            </div>
            <span className="text-gray-500">Dernière maj: il y a quelques secondes</span>
          </div>
        </div>
      </div>
      
      {/* Contrôles de la carte */}
      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full" style={{backgroundColor: '#4DAEBD'}}></div>
            <span className="text-sm text-gray-600">Livreur</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full" style={{backgroundColor: '#1F55A3'}}></div>
            <span className="text-sm text-gray-600">Votre adresse</span>
          </div>
        </div>
        <button 
          onClick={() => {
            if (mapInstanceRef.current && driverMarkerRef.current) {
              try {
                mapInstanceRef.current.setView([deliveryPosition.lat, deliveryPosition.lng], 15);
              } catch (error) {
                console.error('Erreur lors du centrage sur le livreur:', error);
              }
            }
          }}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          disabled={!leafletLoaded}
        >
          Centrer sur le livreur
        </button>
        {distanceKm && durationMin && (
          <div className="text-sm text-gray-600">
            <p>Distance : {distanceKm} km</p>
            <p>Durée estimée : {durationMin} min</p>

          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveMap;