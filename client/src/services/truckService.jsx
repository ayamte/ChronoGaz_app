import api from './api';

export const truckService = {
  async getTrucks(params = {}) {
    try {
      // Vous devrez créer cet endpoint dans votre backend
      // ou adapter selon votre structure existante
      const response = await api.get('/trucks', { params });
      
      // Transformer les données si nécessaire
      const trucks = response.data.data || response.data || [];
      
      return {
        data: trucks.map(truck => ({
          id: truck._id,
          plateNumber: truck.matricule,
          model: truck.marque || truck.modele,
          driverName: truck.chauffeur_principal || 'Non assigné',
          status: truck.disponible ? 'available' : 'busy'
        }))
      };
    } catch (error) {
      console.error('Erreur getTrucks:', error);
      throw error;
    }
  },

  async getTruck(truckId) {
    try {
      const response = await api.get(`/trucks/${truckId}`);
      return response.data.data;
    } catch (error) {
      console.error('Erreur getTruck:', error);
      throw error;
    }
  },

  async getAvailableTrucks(date) {
    try {
      const response = await api.get('/trucks', { 
        params: { 
          available: true,
          date: date 
        } 
      });
      return response.data;
    } catch (error) {
      console.error('Erreur getAvailableTrucks:', error);
      throw error;
    }
  }
};