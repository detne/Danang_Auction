// src/services/participation.js
import apiClient from './api';

export const participationAPI = {
    getUserParticipations: (params) => apiClient.get('/participations', { params }),
};