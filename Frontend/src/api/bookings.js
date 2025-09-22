import apiClient from './client';

export const bookingsAPI = {
  create: async (bookingData) => {
    const response = await apiClient.post('/bookings', bookingData);
    return response.data;
  },
  
  update: async (id, bookingData) => {
    const response = await apiClient.patch(`/bookings/${id}`, bookingData);
    return response.data;
  },
  
  cancel: async (id) => {
    const response = await apiClient.post(`/bookings/${id}/cancel`);
    return response.data;
  },
  
  approve: async (id, approvalData) => {
    const response = await apiClient.post(`/bookings/${id}/approve`, approvalData);
    return response.data;
  },
  
  getPendingCount: async () => {
    const response = await apiClient.get('/bookings/dashboard/pending-count');
    return response.data;
  },
  
  getFutureApprovedCount: async () => {
    const response = await apiClient.get('/bookings/dashboard/future-approved-count');
    return response.data;
  },
  
  getOwnerHistory: async (nic) => {
    const response = await apiClient.get(`/bookings/owner/${nic}/history`);
    return response.data;
  },
  
  getAll: async () => {
    const response = await apiClient.get('/bookings');
    return response.data;
  }
};