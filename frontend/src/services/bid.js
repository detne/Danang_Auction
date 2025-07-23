// src/services/bid.js
import apiClient from './api';

export const bidAPI = {
  // 1. Đặt giá cho phiên đấu giá
  submitBid: (sessionId, price, token) =>
    apiClient.post(
      `/sessions/${sessionId}/bids`,
      { price },
      {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined,
      }
    ),

  // 2. Lấy giá hiện tại của phiên đấu giá
  getCurrentPrice: (sessionId) =>
    apiClient.get(`/sessions/${sessionId}/current-price`),

  // 3. Lấy danh sách người tham gia phiên đấu giá
  getParticipants: (sessionId, token) =>
    apiClient.get(`/sessions/${sessionId}/participants`, {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : undefined,
    }),

  // 4. Đăng ký tham gia phiên đấu giá (BIDDER)
  registerParticipant: (sessionCode, token) =>
    apiClient.post(
      `/sessions/${sessionCode}/register`,
      {},
      {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined,
      }
    ),
};
