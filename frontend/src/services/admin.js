// src/services/admin.js
import apiClient from './api';

export const adminAPI = {
    getStats: () => apiClient.get('/admin/stats'),
    getUsers: () => apiClient.get('/admin/users'),
    getAuctions: () => apiClient.get('/admin/auctions'),
    getCategories: () => apiClient.get('/admin/categories'),
};