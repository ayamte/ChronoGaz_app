// services/orderService.js
import axios from 'axios';
import api from './api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Création de l'adresse de livraison
export const createDeliveryAddress = async (addressData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/address`, {
      num_appt: addressData.num_appt || '',
      num_immeuble: addressData.num_immeuble || '',
      rue: addressData.rue || 'Adresse inconnue',
      quartier: addressData.quartier || '',
      ville: addressData.ville || 'Casablanca',
      code_postal: addressData.code_postal || '',
      region_id: addressData.region_id,
      latitude: addressData.latitude || null,
      longitude: addressData.longitude || null,
      type_adresse: 'LIVRAISON',
      telephone: addressData.telephone || addressData.phone || '',
      instructions_livraison: addressData.instructions_livraison || addressData.instructions || '',
      actif: true
    });
    return response.data.data;
  } catch (error) {
    console.error("❌ Erreur création adresse:", error);
    throw error;
  }
};

// Création de commande complète
export const createOrderFromSteps = async (orderData) => {
  try {
    let addressId = null;

    // --- ÉTAPE 1: GESTION DE L'ADRESSE DE LIVRAISON ---
    // Si l'adresse a déjà un ID, c'est une adresse existante.
    // On l'utilise directement.
    if (orderData.address?._id) {
        console.log('📍 Utilisation d\'une adresse existante:', orderData.address._id);
        addressId = orderData.address._id;
    } 
    // Sinon, on crée une nouvelle adresse.
    else if (orderData.useGPS && orderData.gpsLocation) {
      console.log('📍 Création d\'une nouvelle adresse GPS...');
      const gpsAddress = await createDeliveryAddress({
        rue: 'Position GPS',
        ville: 'Casablanca',
        region_id: orderData.address?.region_id || null,
        latitude: orderData.gpsLocation.latitude,
        longitude: orderData.gpsLocation.longitude,
        telephone: orderData.address?.telephone || ''
      });
      addressId = gpsAddress._id;
    }
    else if (orderData.address) {
      console.log('📍 Création d\'une nouvelle adresse manuelle...');
      if (!orderData.address.rue || !orderData.address.ville || !orderData.address.region_id || !orderData.address.telephone) {
        throw new Error("Veuillez remplir tous les champs obligatoires: rue, ville, région et téléphone");
      }
      const manualAddress = await createDeliveryAddress(orderData.address);
      addressId = manualAddress._id;
    } else {
      throw new Error("Aucune adresse de livraison fournie");
    }

    // --- ÉTAPE 2: Création de la commande avec l'ID de l'adresse ---
    const lignes = orderData.products.filter(product => orderData.quantities[product.id] > 0).map(product => ({
      product_id: product.id,
      um_id: product.um_id || null,
      quantite: orderData.quantities[product.id],
      prix_unitaire: orderData.prices[product.id]
    }));

    if (lignes.length === 0) {
      throw new Error("Aucun produit sélectionné");
    }

    const generateOrderNumber = () => 'CMD-' + Date.now();

    const response = await axios.post(`${API_BASE_URL}/commands`, {
      numero_commande: generateOrderNumber(),
      customer_id: orderData.clientId || '688bec637e0be4e53374e39e',
      address_livraison_id: addressId,
      lignes: lignes,
      date_commande: new Date(),
      date_souhaite: orderData.desiredDate || null,
      urgent: false,
      commentaires: orderData.additionalInfo || '',
      total_ht: orderData.subtotal || 0,
      total_tva: orderData.tva || 0,
      total_ttc: orderData.total || 0,
      statut_id: '688bec6361019bd9d174e3b0'
    });

    return response.data.data;
  } catch (error) {
    console.error("❌ Erreur création commande:", error);
    throw error;
  }
};

// --------------------
// Validation d'adresse
// --------------------
export const validateAddress = (address, useGPS) => {
  if (useGPS) return true;
  const requiredFields = ['rue', 'ville', 'region_id', 'telephone'];
  const missingFields = requiredFields.filter(field => !address[field]);
  if (missingFields.length > 0) {
    console.warn('Champs manquants:', missingFields);
    return false;
  }
  return true;
};

// --------------------
// Service principal
// --------------------
export const orderService = {
  createDeliveryAddress,
  createOrderFromSteps,
  validateAddress,

  async getOrders(params = {}) {
    const {
      page = 1,
      limit = 20,
      search,
      status, // Le statut local (e.g., 'assigned')
      priority,
      dateFrom,
      dateTo,
      customerId
    } = params;
    
    // ✅ CORRECTION : Mappage du statut local au code de statut du backend
    const backendStatus = status ? this.mapLocalStatusToBackend(status) : null;
    console.log('➡️ Statut local converti en statut backend:', status, '->', backendStatus);

    try {
      const response = await api.get('/commands', { 
        params: {
          page,
          limit,
          search,
          status: backendStatus, // ✅ Utilisation du statut converti
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
          name: command.customer_id.physical_user_id?.first_name + ' ' + command.customer_id.physical_user_id?.last_name || command.customer_id.customer_code,
          phone: command.customer_id.physical_user_id?.telephone_principal || '', // Correction ici
          email: command.customer_id.physical_user_id?.user_id?.email || ''
        },
        deliveryAddress: {
          id: command.address_livraison_id._id,
          street: command.address_livraison_id.rue,
          city: command.address_livraison_id.ville,
          postalCode: command.address_livraison_id.code_postal,
        },
        orderDate: command.date_commande,
        requestedDeliveryDate: command.date_souhaite || command.date_commande,
        status: this.mapStatusToLocal(command.statut_id.code),
        priority: command.urgent ? 'high' : 'medium',
        assignedTruckId: command.planification?.truck_id?._id || null,
        assignedTruck: command.planification?.truck_id ? {
          id: command.planification.truck_id._id,
          plateNumber: command.planification.truck_id.matricule,
          model: command.planification.truck_id.marque,
          driverName: command.planification.livreur_id?.physical_user_id?.first_name + ' ' + 
                     command.planification.livreur_id?.physical_user_id?.last_name
        } : null,
        products: command.lignes || [],
        totalAmount: command.total_ttc,
        customerNotes: command.commentaires || '',
        orderSource: 'website',
        createdAt: command.createdAt,
        updatedAt: command.updatedAt
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
      
      return {
        id: command._id,
        orderNumber: command.numero_commande,
        customer: {
          id: command.customer_id._id,
          // Use the nested physical_user_id for name and phone
          name: command.customer_id.physical_user_id?.first_name + ' ' + command.customer_id.physical_user_id?.last_name || command.customer_id.customer_code,
          phone: command.customer_id.physical_user_id?.telephone_principal || '',
          email: command.customer_id.physical_user_id?.user_id?.email || ''
        },
        deliveryAddress: {
          id: command.address_livraison_id._id,
          street: command.address_livraison_id.rue,
          city: command.address_livraison_id.ville,
          postalCode: command.address_livraison_id.code_postal,
        },
        orderDate: command.date_commande,
        requestedDeliveryDate: command.date_souhaite || command.date_commande,
        status: this.mapStatusToLocal(command.statut_id.code),
        priority: command.urgent ? 'high' : 'medium',
        products: response.data.data.lignes || [],
        totalAmount: command.total_ttc,
        customerNotes: command.commentaires || '',
        assignedTruck: response.data.data.planification?.truck_id || null,
        history: this.generateHistory(command)
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

  async getOrderStats() {
    try {
      const response = await api.get('/commands/stats');
      const stats = response.data.data;
      
      let pending = 0, assigned = 0, inProgress = 0, delivered = 0;
      
      stats.repartitionParStatut.forEach(stat => {
        const statusCode = stat.statut[0]?.code;
        switch(statusCode) {
          case 'NOUVELLE':
          case 'CONFIRMEE':
          case 'EN_ATTENTE': 
            pending += stat.count; 
            break;
          case 'PLANIFIEE': assigned = stat.count; break;
          case 'EN_COURS': inProgress = stat.count; break;
          case 'LIVREE': delivered = stat.count; break;
        }
      });
      
      return {
        total: stats.totalCommandes,
        pending,
        assigned,
        inProgress,
        delivered
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

  async cancelAssignment(orderId) {
    try {
      const response = await api.put(`/commands/${orderId}/cancel`);
      return response.data.data;
    } catch (error) {
      console.error('Erreur cancelAssignment:', error);
      throw error;
    }
  },

  async updateOrderStatus(orderId, status, notes = '') {
    try {
      const statusId = await this.getStatusId(this.mapLocalStatusToBackend(status));
      const response = await api.put(`/commands/${orderId}/status`, {
        statut_id: statusId,
        commentaires: notes
      });
      return response.data.data;
    } catch (error) {
      console.error('Erreur updateOrderStatus:', error);
      throw error;
    }
  },

  // Utilitaires
  mapStatusToLocal(backendStatus) {
    const statusMap = {
      'NOUVELLE': 'pending',
      'CONFIRMEE': 'pending',
      'PLANIFIEE': 'assigned',
      'EN_COURS': 'in_progress',
      'LIVREE': 'delivered',
      'ANNULEE': 'cancelled'
    };
    return statusMap[backendStatus] || 'pending';
  },

  // ✅ NOUVELLE FONCTION : Mappe le statut local au code du backend
  mapLocalStatusToBackend(localStatus) {
    const statusMap = {
      'pending': 'CONFIRMEE',
      'assigned': 'PLANIFIEE',
      'in_progress': 'EN_COURS',
      'delivered': 'LIVREE',
      'cancelled': 'ANNULEE'
    };
    return statusMap[localStatus] || null;
  },

  async getStatusId(statusCode) {
    const statusIds = {
      'NOUVELLE': '688bec6361019bd9d174e3af',
      'CONFIRMEE': '688bec6361019bd9d174e3b0',
      'PLANIFIEE': '688bec6361019bd9d174e3b1',
      'EN_COURS': '688bec6361019bd9d174e3b2',
      'LIVREE': '688bec6361019bd9d174e3b3',
      'ANNULEE': '688bec6361019bd9d174e3b4'
    };
    return statusIds[statusCode];
  },

  generateHistory(command) {
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
    return history;
  }
};
