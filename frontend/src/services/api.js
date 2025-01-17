import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
const authAPI = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  verify: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  
  // Social login methods
  loginWithGoogle: async () => {
    const googleProvider = new window.google.accounts.oauth2.initCodeClient({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      scope: 'email profile',
      callback: async (response) => {
        if (response.code) {
          return api.post('/users/auth/google', { code: response.code });
        }
      },
    });
    googleProvider.requestCode();
  },

  loginWithGithub: async () => {
    const githubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/github/callback`;
    const scope = 'user:email';
    
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  },

  loginWithTwitter: async () => {
    const twitterClientId = process.env.REACT_APP_TWITTER_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/twitter/callback`;
    const scope = 'tweet.read users.read';
    
    window.location.href = `https://twitter.com/i/oauth2/authorize?client_id=${twitterClientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
  },

  // Handle OAuth callbacks
  handleGoogleCallback: (code) => api.post('/users/auth/google/callback', { code }),
  handleGithubCallback: (code) => api.post('/users/auth/github/callback', { code }),
  handleTwitterCallback: (code) => api.post('/users/auth/twitter/callback', { code }),
};

// Wallets API
const walletsAPI = {
  getAll: () => api.get('/wallets'),
  getOne: (id) => api.get(`/wallets/${id}`),
  create: (data) => api.post('/wallets', data),
  update: (id, data) => api.put(`/wallets/${id}`, data),
  delete: (id) => api.delete(`/wallets/${id}`),
  updateBudget: (id, data) => api.put(`/wallets/${id}/budget`, data),
};

// Transactions API
const transactionsAPI = {
  getAll: (walletId) => api.get(`/transactions${walletId ? `?wallet=${walletId}` : ''}`),
  getOne: (id) => api.get(`/transactions/${id}`),
  create: (data) => api.post('/transactions', data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`),
  getReport: (params) => api.get('/transactions/report', { params }),
  getSummary: (params) => api.get('/transactions/summary', { params }),
};

// Categories API
const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getOne: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Reports API
const reportsAPI = {
  getSummary: (params) => api.get('/reports/summary', { params }),
  getCategoryReport: (params) => api.get('/reports/categories', { params }),
  getBudgetReport: (params) => api.get('/reports/budget', { params }),
  exportReport: (type, params) => api.get('/reports/export', {
    params: { ...params, type },
    responseType: 'blob'
  }),
};

export {
  api as default,
  authAPI,
  walletsAPI,
  transactionsAPI,
  categoriesAPI,
  reportsAPI,
};
