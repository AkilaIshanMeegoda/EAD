import apiClient from './client';

export const evOwnersAPI = {
  create: async (ownerData) => {
    const response = await apiClient.post('/evowners', ownerData);
    return response.data;
  },
  
  update: async (nic, ownerData) => {
    const response = await apiClient.patch(`/evowners/${nic}`, ownerData);
    return response.data;
  },
  
  deactivate: async (nic) => {
    const response = await apiClient.post(`/evowners/${nic}/deactivate`);
    return response.data;
  },
  
  activate: async (nic) => {
    const response = await apiClient.post(`/evowners/${nic}/activate`);
    return response.data;
  }
};