import { useState, useEffect, useCallback, useRef } from 'react';
import { deliveryService } from '../services/api';
import { useWebSocket } from './useWebSocket';

const GRAPHHOPPER_API_KEY = '6fe731b8-5611-4fb5-afa2-da5059ae2564';

export const useDeliveryTracking = (deliveryId, options = {}) => {
  const {
    enabled = true,
    interval = 10000,
    onPositionUpdate,
    onStatusChange,
    realTimeUpdates = true
  } = options;

  const [deliveryData, setDeliveryData] = useState(null);
  const [driverPosition, setDriverPosition] = useState(null);
  const [destinationPosition, setDestinationPosition] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const intervalRef = useRef(null);
  const lastDriverPositionRef = useRef(null);
  const { subscribe, identify, isConnected } = useWebSocket(realTimeUpdates);

  // Vérifie si le livreur a bougé suffisamment pour recalculer la route
  const hasMovedSignificantly = (pos1, pos2) => {
    if (!pos1 || !pos2) return true;
    const deltaLat = Math.abs(pos1.lat - pos2.lat);
    const deltaLng = Math.abs(pos1.lng - pos2.lng);
    return deltaLat > 0.0001 || deltaLng > 0.0001;
  };

  const calculateRouteInfo = useCallback(async (start, end) => {
    try {
      const url = `https://graphhopper.com/api/1/route?point=${start.latitude},${start.longitude}&point=${end.latitude},${end.longitude}&vehicle=car&locale=fr&calc_points=true&key=${GRAPHHOPPER_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.paths && data.paths.length > 0) {
        const route = data.paths[0];
        setRouteInfo({
          distance: (route.distance / 1000).toFixed(1),
          duration: Math.round(route.time / 60000), // GraphHopper renvoie en millisecondes
          geometry: route.points
        });
      }
    } catch (err) {
      console.error('Erreur calcul route:', err);
    }
  }, []);

  const fetchDeliveryData = useCallback(async () => {
    if (!deliveryId || !enabled) return;

    try {
      setError(null);
      const response = await deliveryService.getDeliveryTracking(deliveryId);

      if (response.data.success) {
        const data = response.data.data;
        setDeliveryData(data);

        if (data.derniere_position) {
          const newDriverPos = {
            lat: data.derniere_position.latitude,
            lng: data.derniere_position.longitude,
            timestamp: data.derniere_position.timestamp
          };

          setDriverPosition(newDriverPos);
          lastDriverPositionRef.current = newDriverPos;

          if (onPositionUpdate) onPositionUpdate(newDriverPos);
        }

        if (data.destination) {
          const newDest = {
            lat: data.destination.latitude,
            lng: data.destination.longitude
          };
          setDestinationPosition(newDest);
        }

        if (data.derniere_position && data.destination) {
          calculateRouteInfo(data.derniere_position, data.destination);
        }

        if (onStatusChange && data.statut_livraison) {
          onStatusChange(data.statut_livraison);
        }
      }
    } catch (err) {
      console.error('Erreur tracking:', err);
      setError('Erreur lors de la récupération des données de tracking');
    } finally {
      setLoading(false);
    }
  }, [deliveryId, enabled, onPositionUpdate, onStatusChange, calculateRouteInfo]);

  useEffect(() => {
    if (deliveryId && enabled) {
      fetchDeliveryData();
    }
  }, [deliveryId, enabled, fetchDeliveryData]);

  useEffect(() => {
    // ❌ Ne pas lancer de polling si WebSocket est actif
    if (!enabled || !deliveryId || interval <= 0 || realTimeUpdates) return;

    intervalRef.current = setInterval(fetchDeliveryData, interval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchDeliveryData, enabled, deliveryId, interval, realTimeUpdates]);

  useEffect(() => {
    if (realTimeUpdates && deliveryId && isConnected) {
      identify(null, deliveryId, 'customer');

      const unsubscribePosition = subscribe('position_updated', (data) => {
        if (data.deliveryId === deliveryId) {
          const newPosition = {
            lat: data.position.latitude,
            lng: data.position.longitude,
            timestamp: data.timestamp
          };

          if (hasMovedSignificantly(lastDriverPositionRef.current, newPosition)) {
            lastDriverPositionRef.current = newPosition;
            setDriverPosition(newPosition);
            if (onPositionUpdate) onPositionUpdate(newPosition);

            if (destinationPosition) {
              calculateRouteInfo(
                { latitude: newPosition.lat, longitude: newPosition.lng },
                { latitude: destinationPosition.lat, longitude: destinationPosition.lng }
              );
            }
          }
        }
      });

      const unsubscribeStatus = subscribe('status_updated', (data) => {
        if (data.deliveryId === deliveryId) {
          setDeliveryData(prev => ({
            ...prev,
            statut_livraison: data.status
          }));
          if (onStatusChange) onStatusChange(data.status);
        }
      });

      return () => {
        unsubscribePosition();
        unsubscribeStatus();
      };
    }
  }, [
    realTimeUpdates,
    deliveryId,
    isConnected,
    subscribe,
    identify,
    onPositionUpdate,
    onStatusChange,
    destinationPosition,
    calculateRouteInfo
  ]);

  const refetch = useCallback(() => {
    setLoading(true);
    fetchDeliveryData();
  }, [fetchDeliveryData]);

  return {
    deliveryData,
    driverPosition,
    destinationPosition,
    routeInfo,
    loading,
    error,
    refetch,
    isConnected
  };
};