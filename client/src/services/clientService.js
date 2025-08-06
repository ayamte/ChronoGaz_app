import { authService } from './authService';  
  
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';  
  
export const clientService = {  
  // Récupérer tous les clients  
  getAll: async () => {  
    try {  
      const token = authService.getToken();  
      const response = await fetch(`${API_BASE_URL}/api/customers`, {  
        headers: {  
          'Authorization': `Bearer ${token}`,  
          'Content-Type': 'application/json'  
        }  
      });  
        
      if (response.status === 401) {  
        authService.logout();  
        return { success: false, message: 'Session expirée' };  
      }  
        
      return response.json();  
    } catch (error) {  
      console.error('Erreur lors de la récupération des clients:', error);  
      return { success: false, message: 'Erreur de connexion' };  
    }  
  },  
  
  // Créer un nouveau client  
  create: async (clientData) => {  
    try {  
      const token = authService.getToken();  
      const response = await fetch(`${API_BASE_URL}/api/customers`, {  
        method: 'POST',  
        headers: {  
          'Authorization': `Bearer ${token}`,  
          'Content-Type': 'application/json'  
        },  
        body: JSON.stringify(clientData)  
      });  
        
      if (response.status === 401) {  
        authService.logout();  
        return { success: false, message: 'Session expirée' };  
      }  
        
      return response.json();  
    } catch (error) {  
      console.error('Erreur lors de la création du client:', error);  
      return { success: false, message: 'Erreur de connexion' };  
    }  
  },  
  
  // Mettre à jour un client  
  update: async (id, clientData) => {  
    try {  
      const token = authService.getToken();  
      const response = await fetch(`${API_BASE_URL}/api/customers/${id}`, {  
        method: 'PUT',  
        headers: {  
          'Authorization': `Bearer ${token}`,  
          'Content-Type': 'application/json'  
        },  
        body: JSON.stringify(clientData)  
      });  
        
      if (response.status === 401) {  
        authService.logout();  
        return { success: false, message: 'Session expirée' };  
      }  
        
      return response.json();  
    } catch (error) {  
      console.error('Erreur lors de la mise à jour du client:', error);  
      return { success: false, message: 'Erreur de connexion' };  
    }  
  },  
  
  // Supprimer un client  
  delete: async (id) => {  
    try {  
      const token = authService.getToken();  
      const response = await fetch(`${API_BASE_URL}/api/customers/${id}`, {  
        method: 'DELETE',  
        headers: {  
          'Authorization': `Bearer ${token}`,  
          'Content-Type': 'application/json'  
        }  
      });  
        
      if (response.status === 401) {  
        authService.logout();  
        return { success: false, message: 'Session expirée' };  
      }  
        
      return response.json();
    } catch (error) {  
      console.error('Erreur lors de la suppression du client:', error);  
      return { success: false, message: 'Erreur de connexion' };  
    }  
  },  
  
  // Rechercher des clients par critères  
  search: async (searchTerm) => {  
    try {  
      const token = authService.getToken();  
      const response = await fetch(`${API_BASE_URL}/api/customers/search?q=${encodeURIComponent(searchTerm)}`, {  
        headers: {  
          'Authorization': `Bearer ${token}`,  
          'Content-Type': 'application/json'  
        }  
      });  
        
      if (response.status === 401) {  
        authService.logout();  
        return { success: false, message: 'Session expirée' };  
      }  
        
      return response.json();  
    } catch (error) {  
      console.error('Erreur lors de la recherche de clients:', error);  
      return { success: false, message: 'Erreur de connexion' };  
    }  
  },  
  
  // Obtenir un client par ID  
  getById: async (id) => {  
    try {  
      const token = authService.getToken();  
      const response = await fetch(`${API_BASE_URL}/api/customers/${id}`, {  
        headers: {  
          'Authorization': `Bearer ${token}`,  
          'Content-Type': 'application/json'  
        }  
      });  
        
      if (response.status === 401) {  
        authService.logout();  
        return { success: false, message: 'Session expirée' };  
      }  
        
      return response.json();  
    } catch (error) {  
      console.error('Erreur lors de la récupération du client:', error);  
      return { success: false, message: 'Erreur de connexion' };  
    }  
  },  
  
  // Obtenir les statistiques des clients  
  getStats: async () => {  
    try {  
      const token = authService.getToken();  
      const response = await fetch(`${API_BASE_URL}/api/customers/stats`, {  
        headers: {  
          'Authorization': `Bearer ${token}`,  
          'Content-Type': 'application/json'  
        }  
      });  
        
      if (response.status === 401) {  
        authService.logout();  
        return { success: false, message: 'Session expirée' };  
      }  
        
      return response.json();  
    } catch (error) {  
      console.error('Erreur lors de la récupération des statistiques:', error);  
      return { success: false, message: 'Erreur de connexion' };  
    }  
  },  
  
  // Changer le statut d'un client  
  updateStatus: async (id, status) => {  
    try {  
      const token = authService.getToken();  
      const response = await fetch(`${API_BASE_URL}/api/customers/${id}/status`, {  
        method: 'PATCH',  
        headers: {  
          'Authorization': `Bearer ${token}`,  
          'Content-Type': 'application/json'  
        },  
        body: JSON.stringify({ statut: status })  
      });  
        
      if (response.status === 401) {  
        authService.logout();  
        return { success: false, message: 'Session expirée' };  
      }  
        
      return response.json();  
    } catch (error) {  
      console.error('Erreur lors de la mise à jour du statut:', error);  
      return { success: false, message: 'Erreur de connexion' };  
    }  
  }  
};  
  
export default clientService;