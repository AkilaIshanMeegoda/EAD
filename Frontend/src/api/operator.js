import apiClient from './client';

export const operatorAPI = {
  scanQR: async (qrPayload) => {
    const response = await apiClient.post('/operator/scan-qr', { QrPayload: qrPayload });
    return response.data;
  },
  
  finalizeBooking: async (id) => {
    const response = await apiClient.post(`/operator/finalize/${id}`);
    return response.data;
  }
};