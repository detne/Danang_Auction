// src/services/asset.js
import apiClient from './api';

export const assetAPI = {
    // 1. Tìm kiếm theo keyword (nếu cần)
    searchAssets: (params) => apiClient.get('/assets/search', { params }),

    // 3. Lấy tài sản theo ID
    getAssetById: (id) => apiClient.get(`/assets/${id}`),

    // 4. Tạo tài sản (JSON hoặc multipart tuỳ backend)
    createAsset: (data) => apiClient.post('/assets', data),

    // 5. Cập nhật tài sản
    updateAsset: (id, data) => apiClient.put(`/assets/${id}`, data),

    // 6. Xoá tài sản
    deleteAsset: (id) => apiClient.delete(`/assets/${id}`),

    // 7. Lấy tài sản theo status (admin)
    getAssetsByStatus: (status) => apiClient.get('/assets', { params: { status } }),

    // 8. Upload ảnh cho tài sản
    uploadAssetImages: (assetId, files) => {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file)); // key phải là 'files'!
    
        // KHÔNG truyền headers, axios sẽ tự động set chuẩn
        return apiClient.post(`/assets/${assetId}/images`, formData);
    },    

    // 9. Duyệt tài sản (admin)
    reviewAsset: (id, action, reason) =>
        apiClient.put(`/assets/admin/${id}/review`, { action, reason }),

    // 10. Xoá ảnh
    deleteAssetImage: (imageId) => apiClient.delete(`/assets/images/${imageId}`),

    // 11. Lấy tài sản của người dùng hiện tại
    getMyAssets: () => apiClient.get('/assets/mine'),
};
