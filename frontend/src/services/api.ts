import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log the full request details
    console.log('API Request:', {
      method: config.method?.toUpperCase(),
      url: `${API_URL}${config.url || ''}`,
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('API Response:', {
      status: response.status,
      data: response.data,
      url: response.config.url
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      data: error.config?.data
    });
    
    if (error.response?.status === 401) {
      // Clear tokens on unauthorized access
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      
      // Only redirect if we're not already on the login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Types
interface CategoryData {
  name: string;
  type: 'income' | 'expense';
  color: string;
}

interface SubcategoryData {
  name: string;
  color: string;
}

// Auth API
export const authAPI = {
  login: (data: { email: string; password: string }) => 
    api.post('/auth/login', data),
  register: (data: any) => 
    api.post('/auth/register', data),
  verify: () => 
    api.get('/auth/profile'),
  updateProfile: (data: any) => 
    api.put('/auth/profile', data),
  updatePassword: (data: any) => 
    api.put('/auth/password', data),
  forgotPassword: (data: { email: string }) => 
    api.post('/auth/forgot-password', data),
  resetPassword: (data: { token: string; password: string }) => 
    api.post('/auth/reset-password', data),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id: string) => api.get(`/categories/${id}`),
  create: (data: CategoryData) => api.post('/categories', data),
  update: (id: string, data: Partial<CategoryData>) => api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
  createSubcategory: (categoryId: string, data: SubcategoryData) => 
    api.post(`/categories/${categoryId}/subcategories`, data),
  updateSubcategory: (categoryId: string, subcategoryId: string, data: Partial<SubcategoryData>) => 
    api.put(`/categories/${categoryId}/subcategories/${subcategoryId}`, data),
  deleteSubcategory: (categoryId: string, subcategoryId: string) => 
    api.delete(`/categories/${categoryId}/subcategories/${subcategoryId}`),
};

// Transactions API
export const transactionsAPI = {
  getAll: () => api.get('/transactions'),
  getById: (id: string) => api.get(`/transactions/${id}`),
  create: (data: any) => api.post('/transactions', data),
  update: (id: string, data: any) => api.put(`/transactions/${id}`, data),
  delete: (id: string) => api.delete(`/transactions/${id}`),
  getReport: (params: any) => api.get('/transactions/report', { params }),
};

// Reports API
export const reportsAPI = {
  generate: (params: any) => api.get('/reports/generate', { params }),
  export: (params: any) => api.get('/reports/export', { 
    params,
    responseType: 'blob'
  }),
};

// Settings API
export const settingsAPI = {
  getAll: () => api.get('/settings'),
  update: (data: any) => api.put('/settings', data),
  updateNotifications: (data: any) => api.put('/settings/notifications', data),
  updatePreferences: (data: any) => api.put('/settings/preferences', data),
};

// Wallets API
export const walletsAPI = {
  getAll: () => api.get('/wallets'),
  getById: (id: string) => api.get(`/wallets/${id}`),
  create: (data: any) => api.post('/wallets', data),
  update: (id: string, data: any) => api.put(`/wallets/${id}`, data),
  delete: (id: string) => api.delete(`/wallets/${id}`),
};

export default api;
