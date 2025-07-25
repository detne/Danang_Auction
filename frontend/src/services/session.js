// src/services/session.js
import apiClient from './api';

export const sessionAPI = {
    getCurrentPrice: (sessionId) => apiClient.get(`/sessions/${sessionId}/current-price`),

    getParticipants: (sessionId) => apiClient.get(`/sessions/${sessionId}/participants`),

    submitBid: (sessionId, price) =>
        apiClient.post(`/sessions/${sessionId}/bids`, { price }),
};