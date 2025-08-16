import api from './api';    
import { authService } from './authService';    
    
// Création de commande avec nouvelle architecture d'adresses    
export const createOrderFromSteps = async (orderData) => {        
  try {        
    console.log('🛒 Création de commande avec:', orderData);        
        
    const user = authService.getUser();        
    const clientId = user?.customer_id || orderData.clientId;      
        
    // Lignes de commande      
    const lignes = [];        
    orderData.products.forEach(product => {        
      const quantity = orderData.quantities[product._id];        
      const price = orderData.prices[product._id];        
      if (quantity > 0) {        
        lignes.push({        
          product_id: product._id,        
          UM_id: product.unites_mesure?.[0]?.UM_id || null,        
          quantity: quantity,        
          price: price        
        });        
      }        
    });        
        
    if (lignes.length === 0) {        
      throw new Error("Aucun produit sélectionné");        
    }        
        
    // Structure d'adresse corrigée selon le contrôleur    
    let addressPayload = {};        
        
    if (orderData.useGPS && orderData.gpsLocation) {        
      addressPayload = {        
        use_existing_address: false,        
        new_address: {        
          street: 'Position GPS',        
          latitude: orderData.gpsLocation.latitude,        
          longitude: orderData.gpsLocation.longitude,        
          type_adresse: 'LIVRAISON'    
        }        
      };        
    } else if (orderData.selectedExistingAddress) {        
      addressPayload = {        
        use_existing_address: true,        
        address_id: orderData.selectedExistingAddress._id        
      };        
    } else if (orderData.address && orderData.address.new_address) {        
      addressPayload = {        
        use_existing_address: false,        
        new_address: orderData.address.new_address    
      };        
    } else {        
      throw new Error("Aucune adresse de livraison fournie");        
    }        
        
    // Utiliser l'objet api au lieu d'axios directement  
    const response = await api.post('/commands', {      
      customer_id: clientId,      
      address: addressPayload,  
      details: orderData.additionalInfo || '',      
      urgent: false,      
      lignes: lignes      
    });    
        
    return response.data.data;        
  } catch (error) {        
    console.error("❌ Erreur création commande:", error);        
    throw error;        
  }        
};  
    
// ✅ Validation d'adresse corrigée - Sans région    
export const validateAddress = (address, useGPS, selectedExistingAddress) => {    
  if (useGPS) return true;    
  if (selectedExistingAddress) return true;    
      
  // ✅ SUPPRIMER 'region_id' des champs requis    
  const requiredFields = ['street', 'city_id', 'telephone'];    
  const missingFields = requiredFields.filter(field => !address[field]);    
  if (missingFields.length > 0) {    
    console.warn('Champs manquants:', missingFields);    
    return false;    
  }    
  return true;    
};    
    
// Service principal avec toutes les fonctions    
export const orderService = {    
  createOrderFromSteps,    
  validateAddress,    
    
  async getOrders(params = {}) {    
    const {    
      page = 1,    
      limit = 20,    
      search,    
      status,    
      priority,    
      dateFrom,    
      dateTo,    
      customerId    
    } = params;    
          
    // ✅ MODIFIÉ: Ne plus mapper les statuts car le backend gère maintenant les planifications
    try {    
      const response = await api.get('/commands', {    
        params: {    
          page,    
          limit,    
          search,    
          status, // Passer directement le statut frontend
          priority,    
          dateFrom,    
          dateTo,    
          ...(customerId && { customerId })    
        }    
      });    
    
      const transformedData = response.data.data.map(command => ({    
        id: command._id,    
        orderNumber: command.numero_commande,    
        customer: {    
          id: command.customer_id._id,    
          name: command.customer_id?.physical_user_id?.first_name ||    
                command.customer_id?.moral_user_id?.raison_sociale ||    
                command.customer_id.customer_code,    
          phone: command.customer_id.physical_user_id?.telephone_principal ||    
                 command.customer_id.moral_user_id?.telephone_principal || '',    
        },    
        deliveryAddress: command.address_id ? {    
          address: `${command.address_id.numimmeuble || ''} ${command.address_id.street || ''}`.trim(),    
          city: command.address_id.city_id?.name || 'Casablanca',  
          quartier: command.address_id.quartier || '',    
          latitude: command.address_id.latitude,    
          longitude: command.address_id.longitude    
        } : null,    
        orderDate: command.date_commande,    
        requestedDeliveryDate: command.date_souhaite || command.date_commande,    
        // ✅ MODIFIÉ: Déterminer le statut basé sur la planification
        status: this.mapPlanificationToStatus(command.planification, command.livraison),    
        // ✅ MODIFIÉ: Priorité basée sur la planification
        priority: command.planification?.priority || (command.urgent ? 'high' : 'medium'),    
        assignedTruckId: command.planification?.trucks_id?._id || null,    
        assignedTruck: command.planification?.trucks_id ? {    
          id: command.planification.trucks_id._id,    
          plateNumber: command.planification.trucks_id.matricule,    
          model: command.planification.trucks_id.marque,    
          capacity: command.planification.trucks_id.capacite,
          driverName: command.planification.livreur_employee_id?.physical_user_id 
            ? `${command.planification.livreur_employee_id.physical_user_id.first_name} ${command.planification.livreur_employee_id.physical_user_id.last_name}`
            : 'Non assigné'
        } : null,    
        products: command.lignes || [],    
        customerNotes: command.details || '',    
        orderSource: 'website',    
        createdAt: command.createdAt,    
        updatedAt: command.updatedAt,
        // ✅ NOUVEAU: Ajouter les données de planification et livraison
        planification: command.planification,
        livraison: command.livraison
      }));    
    
      return {    
        data: transformedData,    
        total: response.data.count || transformedData.length,    
        totalPages: Math.ceil((response.data.count || transformedData.length) / limit)    
      };    
    } catch (error) {    
      console.error('Erreur getOrders:', error);    
      throw error;    
    }    
  },    
    
  async getOrder(orderId) {    
    try {    
      const response = await api.get(`/commands/${orderId}`);    
      const command = response.data.data.command;    
      const planification = response.data.data.planification;
            
      return {    
        id: command._id,    
        orderNumber: command.numero_commande,    
        customer: {    
          id: command.customer_id._id,    
          name: command.customer_id.physical_user_id?.first_name + ' ' + command.customer_id.physical_user_id?.last_name ||    
                command.customer_id.moral_user_id?.raison_sociale ||    
                command.customer_id.customer_code,    
          phone: command.customer_id.physical_user_id?.telephone_principal ||    
                 command.customer_id.moral_user_id?.telephone_principal || '',    
          email: command.customer_id.email || ''    
        },    
        deliveryAddress: command.address_id ? {    
          address: `${command.address_id.numimmeuble || ''} ${command.address_id.street || ''}`.trim(),    
          city: command.address_id.city_id?.name || 'Casablanca',  
          quartier: command.address_id.quartier || '',    
          latitude: command.address_id.latitude,    
          longitude: command.address_id.longitude    
        } : null,    
        orderDate: command.date_commande,    
        requestedDeliveryDate: command.date_souhaite || command.date_commande,    
        // ✅ MODIFIÉ: Statut basé sur la planification
        status: this.mapPlanificationToStatus(planification),    
        priority: planification?.priority || (command.urgent ? 'high' : 'medium'),    
        products: response.data.data.lignes || [],    
        customerNotes: command.details || '',    
        assignedTruck: planification?.trucks_id || null,    
        history: this.generateHistory(command, planification)    
      };    
    } catch (error) {    
      console.error('Erreur getOrder:', error);    
      throw error;    
    }    
  },    
    
  async updateOrder(orderId, updateData) {    
    try {    
      const response = await api.put(`/commands/${orderId}`, updateData);    
      return response.data.data;    
    } catch (error) {    
      console.error('Erreur updateOrder:', error);    
      throw error;    
    }    
  },    
    
  // ✅ MODIFIÉ: Statistiques basées sur les planifications
  async getOrderStats() {    
    try {    
      const response = await api.get('/commands/stats');    
      const stats = response.data.data;    
            
      // ✅ MODIFIÉ: Utiliser les nouvelles statistiques du backend
      return {    
        total: stats.totalCommandes,    
        pending: stats.pending || 0,    
        assigned: stats.assigned || 0,    
        inProgress: stats.inProgress || 0,    
        delivered: stats.delivered || 0    
      };    
    } catch (error) {    
      console.error('Erreur getOrderStats:', error);    
      throw error;    
    }    
  },    
    
  async assignTruck(orderId, payload) {    
    try {    
      const response = await api.put(`/commands/${orderId}/status`, payload);    
      return response.data.data;    
    } catch (error) {    
      console.error('Erreur assignTruck:', error);    
      throw error;    
    }    
  },    
    
  // ✅ MODIFIÉ: Utiliser la nouvelle route pour annuler planification
  async cancelAssignment(orderId) {    
    try {    
      const response = await api.put(`/commands/${orderId}/cancel-planification`);    
      return response.data.data;    
    } catch (error) {    
      console.error('Erreur cancelAssignment:', error);    
      throw error;    
    }    
  },    
    
  // ✅ MODIFIÉ: Fonction simplifiée pour la planification
  async updateOrderStatus(orderId, status, notes = '') {    
    try {    
      // Cette fonction n'est plus utilisée avec le nouveau workflow
      console.warn('updateOrderStatus est dépréciée, utiliser assignTruck à la place');
      const response = await api.put(`/commands/${orderId}/status`, {    
        details: notes    
      });    
      return response.data.data;    
    } catch (error) {    
      console.error('Erreur updateOrderStatus:', error);    
      throw error;    
    }    
  },    
    
  // Utiliser l'endpoint existant pour les commandes client  
  async getClientOrders(customerId) {    
    try {    
      const response = await api.get(`/commands/customer/${customerId}`);  
      return response.data;    
    } catch (error) {    
      console.error('Erreur récupération commandes client:', error);    
      throw error;    
    }    
  },    
    
  // Alias pour compatibilité  
  async getOrderById(orderId) {    
    return this.getOrder(orderId);  
  },    
    
  async cancelOrder(orderId, raison_annulation = '') {    
    try {    
      const response = await api.put(`/commands/${orderId}/cancel`, {  
        raison_annulation  
      });    
      return response.data;    
    } catch (error) {    
      console.error('Erreur annulation commande:', error);    
      throw error;    
    }    
  },    
    
  // ✅ NOUVEAU: Mapper l'état de planification vers le statut frontend
  mapPlanificationToStatus(planification, livraison = null) {
    if (!planification) return 'pending';
    
    // Si il y a une livraison, utiliser son état
    if (livraison) {
      switch(livraison.etat) {
        case 'EN_COURS': return 'in_progress';
        case 'LIVRE': return 'delivered';
        case 'ECHEC': return 'cancelled';
        case 'PARTIELLE': return 'in_progress';
        default: return 'assigned';
      }
    }
    
    // Sinon utiliser l'état de la planification
    switch(planification.etat) {
      case 'PLANIFIE': return 'assigned';
      case 'EN_COURS': return 'in_progress';
      case 'LIVRE': return 'delivered';
      case 'ANNULE': return 'cancelled';
      case 'REPORTE': return 'assigned';
      default: return 'pending';
    }
  },
    
  // ✅ MODIFIÉ: Fonctions de mapping dépréciées mais conservées pour compatibilité
  mapLocalStatusToBackend(localStatus) {    
    console.warn('mapLocalStatusToBackend est déprécié avec le nouveau workflow');
    const mapping = {    
      'pending': null, // Pas de planification
      'assigned': 'PLANIFIE',    
      'in_progress': 'EN_COURS',    
      'delivered': 'LIVRE',    
      'cancelled': 'ANNULE'    
    };    
    return mapping[localStatus] || localStatus;    
  },    
    
  mapStatusToLocal(backendStatus) {    
    console.warn('mapStatusToLocal est déprécié avec le nouveau workflow');
    const mapping = {      
      'EN_ATTENTE': 'pending',      
      'PLANIFIEE': 'assigned',      
      'EN_COURS': 'in_progress',      
      'LIVREE': 'delivered',      
      'ANNULEE': 'cancelled'      
    };      
    return mapping[backendStatus] || backendStatus;      
  },      
      
  // ✅ MODIFIÉ: Historique basé sur les planifications et livraisons  
  generateHistory(command, planification = null) {      
    const history = [{      
      id: 'hist-1',      
      action: 'Commande créée',      
      details: 'Commande créée dans le système',      
      timestamp: command.createdAt || command.date_commande,      
      userId: 'system',      
      userName: 'Système'      
    }];      
      
    if (command.updatedAt && command.updatedAt !== command.createdAt) {      
      history.push({      
        id: 'hist-2',      
        action: 'Commande mise à jour',      
        details: 'Commande modifiée',      
        timestamp: command.updatedAt,      
        userId: 'system',      
        userName: 'Système'      
      });      
    }      
      
    // ✅ MODIFIÉ: Utiliser la planification au lieu du statut  
    if (planification) {      
      history.push({      
        id: 'hist-3',      
        action: 'Camion assigné',      
        details: `Camion ${planification.trucks_id?.matricule} assigné`,      
        timestamp: planification.createdAt,      
        userId: planification.created_by || 'system',      
        userName: 'Administrateur'      
      });      
  
      if (planification.etat === 'EN_COURS') {      
        history.push({      
          id: 'hist-4',      
          action: 'Livraison en cours',      
          details: 'Le chauffeur a commencé la livraison',      
          timestamp: planification.updatedAt,      
          userId: 'driver',      
          userName: 'Chauffeur'      
        });      
      }      
        
      if (planification.etat === 'LIVRE') {      
        history.push({      
          id: 'hist-5',      
          action: 'Livraison terminée',      
          details: 'Commande livrée avec succès',      
          timestamp: planification.updatedAt,      
          userId: 'driver',      
          userName: 'Chauffeur'      
        });      
      }  
    }      
      
    return history.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));      
  },      
      
  // Fonction pour créer une commande depuis les étapes du workflow client      
  async createOrder(orderData) {      
    try {      
      const response = await api.post('/commands', orderData);      
      return response.data;      
    } catch (error) {      
      console.error('Erreur création commande:', error);      
      throw error;      
    }      
  },      
      
  // ✅ MODIFIÉ: Fonction pour obtenir les commandes par statut (utilise le nouveau système)  
  async getOrdersByStatus(status) {      
    try {      
      const response = await api.get('/commands', {      
        params: { status } // Passer directement le statut frontend  
      });      
      return response.data.data;      
    } catch (error) {      
      console.error('Erreur récupération commandes par statut:', error);      
      throw error;      
    }      
  },      
      
  // Fonction pour obtenir les commandes urgentes      
  async getUrgentOrders() {      
    try {      
      const response = await api.get('/commands', {      
        params: { priority: 'urgent' }      
      });      
      return response.data.data;      
    } catch (error) {      
      console.error('Erreur récupération commandes urgentes:', error);      
      throw error;      
    }      
  },      
      
  // Fonction pour marquer une commande comme urgente (via update)    
  async markOrderAsUrgent(orderId) {      
    try {      
      const response = await api.put(`/commands/${orderId}`, {      
        urgent: true      
      });      
      return response.data.data;      
    } catch (error) {      
      console.error('Erreur marquage commande urgente:', error);      
      throw error;      
    }      
  },      
      
  // Fonction pour obtenir les commandes d'une période      
  async getOrdersByDateRange(startDate, endDate) {      
    try {      
      const response = await api.get('/commands', {      
        params: {      
          dateFrom: startDate,      
          dateTo: endDate      
        }      
      });      
      return response.data.data;      
    } catch (error) {      
      console.error('Erreur récupération commandes par période:', error);      
      throw error;      
    }      
  },  
  
  // ✅ NOUVEAU: Service pour les livraisons  
  async startDelivery(planificationId, deliveryData) {  
    try {  
      const response = await api.post(`/livraisons/start/${planificationId}`, deliveryData);  
      return response.data.data;  
    } catch (error) {  
      console.error('Erreur démarrage livraison:', error);  
      throw error;  
    }  
  },  
  
  async completeDelivery(livraisonId, completionData) {  
    try {  
      const response = await api.put(`/livraisons/${livraisonId}/complete`, completionData);  
      return response.data.data;  
    } catch (error) {  
      console.error('Erreur finalisation livraison:', error);  
      throw error;  
    }  
  },  
  
  async getDeliveries(params = {}) {  
    try {  
      const response = await api.get('/livraisons', { params });  
      return response.data;  
    } catch (error) {  
      console.error('Erreur récupération livraisons:', error);  
      throw error;  
    }  
  },  
  
  async getDeliveryById(livraisonId) {  
    try {  
      const response = await api.get(`/livraisons/${livraisonId}`);  
      return response.data.data;  
    } catch (error) {  
      console.error('Erreur récupération livraison:', error);  
      throw error;  
    }  
  },  
  
  async updateDeliveryLines(livraisonId, lignes) {  
    try {  
      const response = await api.put(`/livraisons/${livraisonId}/lines`, { lignes });  
      return response.data.data;  
    } catch (error) {  
      console.error('Erreur mise à jour lignes livraison:', error);  
      throw error;  
    }  
  }  
};      
      
export default orderService;