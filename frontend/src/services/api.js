import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const productsAPI = {
  getAll: (skip = 0, limit = 100) => 
    api.get('/products', { params: { skip, limit } }),
  getById: (id) => 
    api.get(`/products/${id}`),
  create: (data) => 
    api.post('/products', data),
  update: (id, data) => 
    api.put(`/products/${id}`, data),
  delete: (id) => 
    api.delete(`/products/${id}`),
};

// Customers API
export const customersAPI = {
  getAll: (skip = 0, limit = 100) => 
    api.get('/customers', { params: { skip, limit } }),
  getById: (id) => 
    api.get(`/customers/${id}`),
  create: (data) => 
    api.post('/customers', data),
  delete: (id) => 
    api.delete(`/customers/${id}`),
};

// Orders API
export const ordersAPI = {
  getAll: (skip = 0, limit = 100) => 
    api.get('/orders', { params: { skip, limit } }),
  getById: (id) => 
    api.get(`/orders/${id}`),
  create: (data) => 
    api.post('/orders', data),
  delete: (id) => 
    api.delete(`/orders/${id}`),
};

// Stats API
export const statsAPI = {
  getDashboard: () => 
    api.get('/stats/dashboard'),
};

export default api;
