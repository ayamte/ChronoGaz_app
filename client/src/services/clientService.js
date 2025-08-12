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
  
// Fonctions de compatibilité pour ghani-dev (adaptent les données)  
export const getClientById = async (clientId) => {  
  try {  
    // Utilise la route customers existante  
    const result = await clientService.getById(clientId);  
      
    if (!result.success || !result.data) {  
      throw new Error('Client non trouvé');  
    }  
      
    const customer = result.data;  
      
    // Adapte la structure pour ghani-dev  
    return {  
      _id: customer._id,  
      customer_code: customer.customer_code,  
      type_client: customer.type_client,  
      ...(customer.physical_user_id && {  
        nom_complet: `${customer.physical_user_id.civilite} ${customer.physical_user_id.first_name} ${customer.physical_user_id.last_name}`,  
        telephone: customer.physical_user_id.telephone_principal,  
        email: customer.physical_user_id.user_id?.email  
      }),  
      ...(customer.moral_user_id && {  
        raison_sociale: customer.moral_user_id.raison_sociale,  
        telephone: customer.moral_user_id.telephone_principal,  
        email: customer.moral_user_id.user_id?.email  
      })  
    };  
  } catch (error) {  
    console.error('Erreur récupération client:', error);  
    throw error;  
  }  
};  
  
export const getClientAddresses = async (clientId) => {  
  try {  
    // Utilise la route customers existante pour récupérer le client  
    const result = await clientService.getById(clientId);  
      
    if (!result.success || !result.data) {  
      return [];  
    }  
      
    const customer = result.data;  
    let addresses = [];  
      
    // Génère une adresse par défaut basée sur les données du client  
    if (customer.physical_user_id) {  
      addresses.push({  
        _id: customer.physical_user_id._id,  
        type_adresse: 'DOMICILE',  
        num_appt: '',  
        num_immeuble: '',  
        rue: customer.physical_user_id.adresse_principale || '',  
        quartier: '',  
        ville: customer.physical_user_id.ville || 'Casablanca',  
        code_postal: '',  
        region_id: customer.physical_user_id.region_principale || '',  
        telephone: customer.physical_user_id.telephone_principal || '',  
        instructions_livraison: '',  
        is_principal: true  
      });  
    } else if (customer.moral_user_id) {  
      addresses.push({  
        _id: customer.moral_user_id._id,  
        type_adresse: 'SIÈGE SOCIAL',  
        num_appt: '',  
        num_immeuble: '',  
        rue: customer.moral_user_id.adresse_principale || '',  
        quartier: '',  
        ville: customer.moral_user_id.ville || 'Casablanca',  
        code_postal: '',  
        region_id: customer.moral_user_id.region_principale || '',  
        telephone: customer.moral_user_id.telephone_principal || '',  
        instructions_livraison: '',  
        is_principal: true  
      });  
    }  
      
    return addresses;  
  } catch (error) {  
    console.error('Erreur récupération adresses client:', error);  
    return [];  
  }  
};  
  
export default clientService;