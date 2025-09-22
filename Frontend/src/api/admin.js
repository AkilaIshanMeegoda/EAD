import apiClient from './client';

export const adminAPI = {
  getUsers: async () => {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },
  
  createUser: async (userData) => {
    const response = await apiClient.post('/admin/users', userData);
    return response.data;
  }
};