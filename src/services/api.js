import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Transaction APIs
export const transactionAPI = {
  // Get all transactions with filters
  getAll: (params = {}) => {
    return api.get('/transactions', { params });
  },

  // Get single transaction
  getById: (id) => {
    return api.get(`/transactions/${id}`);
  },

  // Create new transaction
  create: (data) => {
    return api.post('/transactions', data);
  },

  // Update transaction
  update: (id, data) => {
    return api.put(`/transactions/${id}`, data);
  },

  // Delete transaction
  delete: (id) => {
    return api.delete(`/transactions/${id}`);
  },

  // Get summary statistics
  getSummary: (params = {}) => {
    return api.get('/transactions/stats/summary', { params });
  },

  // Get category statistics
  getCategoryStats: (params = {}) => {
    return api.get('/transactions/stats/category', { params });
  },

  // Get monthly statistics
  getMonthlyStats: (params = {}) => {
    return api.get('/transactions/stats/monthly', { params });
  },
};

export default api;
