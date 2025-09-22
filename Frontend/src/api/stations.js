import apiClient from './client';

export const stationsAPI = {
  create: async (stationData) => {
    const response = await apiClient.post('/stations', stationData);
    return response.data;
  },
  
  update: async (id, stationData) => {
    const response = await apiClient.patch(`/stations/${id}`, stationData);
    return response.data;
  },
  
  getAll: async () => {
    const response = await apiClient.get('/stations');
    return response.data;
  },
  
  addSchedule: async (id, scheduleData) => {
    const response = await apiClient.post(`/stations/${id}/schedule`, scheduleData);
    return response.data;
  }
};