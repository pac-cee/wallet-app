import api from './api';
import { Category, CategoryForm } from '../types';

export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id: string) => api.get(`/categories/${id}`),
  create: (data: CategoryForm) => api.post('/categories', data),
  update: (id: string, data: Partial<CategoryForm>) => api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
  createDefaultCategories: () => api.post('/categories/defaults'),
};

export default categoriesAPI;
