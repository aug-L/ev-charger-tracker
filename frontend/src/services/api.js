import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const getSessions = (status) => api.get('/sessions', { params: { status } });
export const createSession = (data) => api.post('/sessions', data);
export const startSession = (id) => api.post(`/sessions/${id}/start`);
export const stopSession = (id) => api.post(`/sessions/${id}/stop`);

export default api;
