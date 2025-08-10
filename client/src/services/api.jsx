// chronogaz_front/src/services/api.js
import axios from 'axios';

// CORRECTION: URL forcée pour debug
const API_BASE_URL = 'http://localhost:5001/api';
console.log('🔧 API_BASE_URL configurée:', API_BASE_URL);

// Configuration axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Augmenté pour éviter les timeouts
  headers: {
    'Content-Type': 'application/json'
  },
  // Ajout de credentials pour CORS
  withCredentials: true
});

// Intercepteurs pour la gestion des erreurs
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 Requête API: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Erreur requête:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`✅ Réponse API: ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  (error) => {
    console.error('❌ Erreur API:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    
    // Gestion spécifique des erreurs CORS
    if (error.message.includes('Network Error') || error.code === 'ERR_NETWORK') {
      console.error('🚫 Erreur réseau - Vérifiez que le serveur backend est démarré sur le port 5001');
    }
    
    return Promise.reject(error);
  }
);

// Services pour les livraisons
export const deliveryService = {
  // Obtenir toutes les livraisons
  getAllDeliveries: () => api.get('/deliveries'),
  
  // Obtenir les livraisons d'aujourd'hui
  getTodayDeliveries: () => api.get('/deliveries/today'),
  
  // Obtenir une livraison par ID
  getDeliveryById: (id) => api.get(`/deliveries/${id}`),
  
  // CORRECTION: Endpoint tracking corrigé
  getDeliveryTracking: (id) => api.get(`/deliveries/${id}/track`),
  
  // Obtenir la position en temps réel
  getRealTimePosition: (id) => api.get(`/deliveries/${id}/realtime-position`),
  
  // Mettre à jour la position
  updatePosition: (id, position) => 
    api.put(`/deliveries/${id}/position`, position),
  
  // Démarrer une livraison
  startDelivery: (planificationId, data) => 
    api.post(`/deliveries/${planificationId}/start`, data),
  
  // Terminer une livraison
  completeDelivery: (id, data) => 
    api.put(`/deliveries/${id}/complete`, data),
  
  // Statistiques
  getDeliveriesStats: () => api.get('/deliveries/stats')
};

// Services pour les commandes  
export const commandService = {
  getAllCommands: () => api.get('/commands'),
  getCommandById: (id) => api.get(`/commands/${id}`),
  getCommandsByCustomer: (customerId, params = {}) => 
    api.get(`/commands/customer/${customerId}`, { params }),
  createCommand: (data) => api.post('/commands', data),
  updateCommand: (id, data) => api.put(`/commands/${id}`, data),
  deleteCommand: (id) => api.delete(`/commands/${id}`),
  updateCommandStatus: (id, data) => api.put(`/commands/${id}/status`, data)
};

// Service de test pour vérifier la connexion
export const testConnection = async () => {
  try {
    const response = await api.get('/health');
    console.log('✅ Connexion API OK:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Échec connexion API:', error);
    throw error;
  }
};

export default api;