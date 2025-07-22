// src/services/session.js
import apiClient from './api';

export const sessionAPI = {
  // Lấy giá hiện tại
  getCurrentPrice: (sessionId) => apiClient.get(`/sessions/${sessionId}/current-price`),

  // Lấy danh sách người tham gia
  getParticipants: (sessionId) => apiClient.get(`/sessions/${sessionId}/participants`),

  // Nộp giá thầu (bidding)
  submitBid: (sessionId, price) =>
    apiClient.post(`/sessions/${sessionId}/bids`, { price }),

  // ==================== BỔ SUNG MỚI ====================

  // Tìm kiếm/filter phiên đấu giá
  searchSessions: (params = {}) => apiClient.get('/sessions', { params }),

  // Xem chi tiết phiên đấu giá theo ID
  getSessionDetail: (sessionId) => apiClient.get(`/sessions/${sessionId}`),

  // Xem chi tiết phiên đấu giá theo sessionCode
  getSessionDetailByCode: (sessionCode) => apiClient.get(`/sessions/code/${sessionCode}`),

  // Đổi hình thức phiên (public/private)
  updateVisibility: (sessionId, data, token) =>
    apiClient.put(`/sessions/${sessionId}/visibility`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};
