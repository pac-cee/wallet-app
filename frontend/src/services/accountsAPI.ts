import api from './api';
import { AccountFormData } from '../types';

export const accountsAPI = {
  getAll: () => api.get('/accounts'),
  getById: (id: string) => api.get(`/accounts/${id}`),
  create: (data: AccountFormData) => api.post('/accounts', data),
  update: (id: string, data: Partial<AccountFormData>) => api.patch(`/accounts/${id}`, data),
  delete: (id: string) => api.delete(`/accounts/${id}`),
  getStats: () => api.get('/accounts/stats'),
};

export default accountsAPI;
