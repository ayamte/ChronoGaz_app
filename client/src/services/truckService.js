import api from './api';

const truckService = {
  // Récupérer tous les camions
  getAllTrucks: async (params = {}) => {
    try {
      const response = await api.get('/trucks', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des camions:', error);
      throw error;
    }
  },

  // Récupérer un camion par ID
  getTruckById: async (id) => {
    try {
      const response = await api.get(`/trucks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du camion:', error);
      throw error;
    }
  },

  // Récupérer les camions par région
  getTrucksByRegion: async (region) => {
    try {
      const response = await api.get(`/trucks/region/${region}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des camions par région:', error);
      throw error;
    }
  },

  // Récupérer les camions nécessitant une maintenance
  getMaintenanceDueTrucks: async () => {
    try {
      const response = await api.get('/trucks/maintenance-due');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des camions en maintenance:', error);
      throw error;
    }
  },

  // Créer un nouveau camion
  createTruck: async (truckData) => {
    try {
      const response = await api.post('/trucks', truckData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du camion:', error);
      throw error;
    }
  },

  // Mettre à jour un camion
  updateTruck: async (id, truckData) => {
    try {
      const response = await api.put(`/trucks/${id}`, truckData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du camion:', error);
      throw error;
    }
  },

  // Mettre à jour le statut d'un camion
  updateTruckStatus: async (id, status) => {
    try {
      const response = await api.patch(`/trucks/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      throw error;
    }
  },

  // Assigner un chauffeur
  assignDriver: async (id, driverId) => {
    try {
      const response = await api.patch(`/trucks/${id}/driver`, { driverId });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'assignation du chauffeur:', error);
      throw error;
    }
  },

  // Mettre à jour le kilométrage
  updateMileage: async (id, mileage) => {
    try {
      const response = await api.patch(`/trucks/${id}/mileage`, { mileage });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du kilométrage:', error);
      throw error;
    }
  },

  // Supprimer un camion (désactivation)
  deleteTruck: async (id) => {
    try {
      const response = await api.delete(`/trucks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression du camion:', error);
      throw error;
    }
  }
};

export default truckService;
