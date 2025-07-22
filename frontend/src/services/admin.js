import apiClient from './api';

export const adminAPI = {
    getSystemSummary: () => apiClient.get('/admin/stats/summary'),
    getUserStats: () => apiClient.get('/admin/stats/users'),
    getAuctionSessionStats: () => apiClient.get('/admin/stats/auctions'),
    getMonthlyRevenue: () => apiClient.get('/admin/stats/revenue'),
    getRecentWinners: () => apiClient.get('/admin/stats/winners'),

    // Thêm dòng này
    getUsers: () => apiClient.get('/admin/users'),
};
