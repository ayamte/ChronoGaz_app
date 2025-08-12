import api from './api';  
  
const locationService = {  
  getCities: async () => {  
    try {  
      const response = await api.get('/locations/cities');  
      return response.data;  
    } catch (error) {  
      console.error('Erreur lors de la récupération des villes:', error);  
      throw error;  
    }  
  },  
  
  createCity: async (cityData) => {  
    try {  
      const response = await api.post('/locations/cities', cityData);  
      return response.data;  
    } catch (error) {  
      console.error('Erreur lors de la création de la ville:', error);  
      throw error;  
    }  
  },  
  
  updateCity: async (id, cityData) => {  
    try {  
      const response = await api.put(`/locations/cities/${id}`, cityData);  
      return response.data;  
    } catch (error) {  
      console.error('Erreur lors de la mise à jour de la ville:', error);  
      throw error;  
    }  
  },  
  
  deleteCity: async (id) => {  
    try {  
      const response = await api.delete(`/locations/cities/${id}`);  
      return response.data;  
    } catch (error) {  
      console.error('Erreur lors de la suppression de la ville:', error);  
      throw error;  
    }  
  },  
  
  getRegionsByCity: async (cityId) => {  
    try {  
      const response = await api.get(`/locations/cities/${cityId}/regions`);  
      return response.data;  
    } catch (error) {  
      console.error('Erreur lors de la récupération des régions:', error);  
      throw error;  
    }  
  },  
  
  createRegion: async (regionData) => {  
    try {  
      const response = await api.post('/locations/regions', regionData);  
      return response.data;  
    } catch (error) {  
      console.error('Erreur lors de la création de la région:', error);  
      throw error;  
    }  
  },  
  
  updateRegion: async (id, regionData) => {  
    try {  
      const response = await api.put(`/locations/regions/${id}`, regionData);  
      return response.data;  
    } catch (error) {  
      console.error('Erreur lors de la mise à jour de la région:', error);  
      throw error;  
    }  
  },  
  
  deleteRegion: async (id) => {  
    try {  
      const response = await api.delete(`/locations/regions/${id}`);  
      return response.data;  
    } catch (error) {  
      console.error('Erreur lors de la suppression de la région:', error);  
      throw error;  
    }  
  }  
};  
  
export default locationService;