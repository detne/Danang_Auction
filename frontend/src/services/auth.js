import apiClient from './api';

export const authAPI = {
    login: (credentials) => apiClient.post('/auth/login', credentials),

    register: (formData) => {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };
        return apiClient.post('/auth/register', formData, config);
    },

    forgotPassword: (email) => apiClient.post('/auth/forget-password', { email }),

    resetPassword: (data) => apiClient.post('/auth/reset-password', data),

    googleLogin: (token) => apiClient.post('/auth/google', { token }),

    getProfile: () => apiClient.get('/auth/profile'),

    updateProfile: (profileData) => apiClient.put('/auth/profile', profileData),

    verifyIdentity: (data) => apiClient.put('/auth/identity/verify', data),

    logout: () => apiClient.post('/auth/logout'),

    uploadAvatar: (formData) => {
        const config = {
            headers: { 'Content-Type': 'multipart/form-data' },
        };
        return apiClient.post('/auth/avatar', formData, config);
    }

};