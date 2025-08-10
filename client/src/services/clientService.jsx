import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const getClientById = async (clientId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/clients/${clientId}`);
    return response.data.data;
  } catch (error) {
    console.error('Erreur récupération client:', error);
    throw error;
  }
};

export const getClientAddresses = async (clientId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/clients/${clientId}/addresses`);
    return response.data.addresses || [];
  } catch (error) {
    console.error('Erreur récupération adresses client:', error);
    return [];
  }
};