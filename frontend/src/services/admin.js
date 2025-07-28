// src/services/admin.js
import apiClient from './api';

export const adminAPI = {
  // ========================= 🔹 Thống kê (AdminController) =========================

  // 1. Tổng quan hệ thống
  getSystemSummary: () => apiClient.get('/admin/stats/summary'),

  // 2. Thống kê user theo vai trò & trạng thái
  getUserStatstats: () => apiClient.get('/admin/stats/users'),

  // 3. Thống kê phiên đấu giá
  getAuctionSessionStats: () => apiClient.get('/admin/stats/auctions'),

  // 4. Thống kê doanh thu theo tháng
  getMonthlyRevenue: () => apiClient.get('/admin/stats/revenue'),

  // 5. Danh sách người thắng mới nhất
  getRecentWinners: () => apiClient.get('/admin/stats/winners'),

  // ========================= 📦 Tài sản đấu giá (AdminAssetController) =========================

  // Lọc tài sản theo trạng thái và từ khóa
  getAssetsByStatusAndKeyword: (status = 'PENDING_CREATE', q = '') =>
    apiClient.get('/admin/assets', {
      params: {
        status,
        ...(q && { q }),
      },
    }),

  // Duyệt hoặc từ chối tài sản
  reviewAsset: (id, data, token) =>
    apiClient.put(`/admin/assets/${id}/review`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  // Lấy toàn bộ danh sách tài sản (không phân trang)
  getAllAssets: () => apiClient.get('/admin/assets/all'),

  // ========================= ⏱️ Phiên đấu giá (AdminAuctionSessionController) =========================

  // Danh sách phiên đấu giá cho Admin (có filter theo status và q)
  getAdminSessions: (status = '', q = '') =>
    apiClient.get('/admin/sessions', {
      params: {
        ...(status && { status }),
        ...(q && { q }),
      },
    }),
};
