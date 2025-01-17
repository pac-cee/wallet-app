import api from './api';
import { Transaction, TransactionFormData } from '../types';

export const transactionsAPI = {
  getAll: () => api.get('/transactions'),
  getById: (id: string) => api.get(`/transactions/${id}`),
  create: (data: TransactionFormData) => api.post('/transactions', {
    ...data,
    amount: parseFloat(data.amount),
    date: new Date(data.date).toISOString(),
  }),
  update: (id: string, data: Partial<TransactionFormData>) => api.put(`/transactions/${id}`, {
    ...data,
    amount: data.amount ? parseFloat(data.amount) : undefined,
    date: data.date ? new Date(data.date).toISOString() : undefined,
  }),
  delete: (id: string) => api.delete(`/transactions/${id}`),
  getReport: (params: any) => api.get('/transactions/report', { params }),
};

export default transactionsAPI;
