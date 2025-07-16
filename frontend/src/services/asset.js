// src/services/asset.js
import apiClient from './api';

export const assetAPI = {
    searchAssets: (params) => apiClient.get('/assets', { params }),

    getAssetById: (id) => apiClient.get(`/assets/${id}`),

    createAsset: (formData) => {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };
        return apiClient.post('/assets', formData, config);
    },

    updateAsset: (id, data) => apiClient.put(`/assets/${id}`, data),

    deleteAsset: (id) => apiClient.delete(`/assets/delete/${id}`),

    getAssetsByStatus: (status) => apiClient.get('/assets', { params: { status } }),

    uploadAssetImages: (assetId, files) => {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
        return apiClient.post(`/assets/${assetId}/images`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    reviewAsset: (id, action, reason) =>
        apiClient.put(`/assets/admin/${id}/review`, { action, reason }),

    deleteAssetImage: (imageId) => apiClient.delete(`/assets/images/${imageId}`),
};