import React from 'react';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080/api';

const buildUrl = (path) => {
    return `${API_BASE.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

console.log('API_BASE:', API_BASE);

const handleResponse = async (res) => {
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP error! status: ${res.status} - ${errorText || 'Không có chi tiết lỗi'}`);
    }
    const data = await res.json();
    return data; // Trả về nguyên bản, bao gồm success và data
};

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

// Generic API call with support for FormData
const api = async (options = {}) => {
    const { method = 'GET', url, data, headers = {} } = options;
    const authHeaders = getAuthHeaders();
    const defaultHeaders = data instanceof FormData
        ? { ...authHeaders } // Không đặt Content-Type khi dùng FormData
        : { 'Content-Type': 'application/json', ...authHeaders, ...headers };

    const response = await fetch(buildUrl(url), {
        method,
        headers: defaultHeaders,
        body: data instanceof FormData ? data : JSON.stringify(data),
    });
    const text = await response.text();
    const result = text ? JSON.parse(text) : {};
    if (!response.ok) {
        throw new Error(result.message || 'Request failed');
    }
    return result;
};

// Authentication APIs
export const loginUser = async (data) => {
    try {
        const res = await api({
            method: 'POST',
            url: 'auth/login',
            data,
        });
        return res;
    } catch (err) {
        console.error('Login error:', err.message);
        return { success: false, message: err.message };
    }
};

export const registerUser = async (data) => {
    try {
        const res = await api({
            method: 'POST',
            url: 'auth/register',
            data,
        });
        return res;
    } catch (err) {
        console.error('Register error:', err.message);
        return { success: false, message: err.message };
    }
};

// Forgot Password APIs
export const forgotPassword = async (data) => {
    try {
        const res = await api({
            method: 'POST',
            url: 'auth/forget-password',
            data, // Gửi object { email }
        });
        return res;
    } catch (err) {
        console.error('Forgot password error:', err.message);
        return { success: false, message: err.message };
    }
};

export const resetPassword = async (data) => {
    try {
        const res = await api({
            method: 'POST',
            url: 'auth/reset-password',
            data, // Gửi object { email, otp, newPassword, confirmPassword }
        });
        return res;
    } catch (err) {
        console.error('Reset password error:', err.message);
        return { success: false, message: err.message };
    }
};

// User Profile APIs
export const getUserProfile = async (token) => {
    try {
        const res = await api({
            method: 'GET',
            url: 'auth/profile',
            headers: { Authorization: `Bearer ${token || localStorage.getItem('token')}` },
        });
        return res.success ? res.data : { success: false, message: 'Invalid profile data' };
    } catch (err) {
        console.error('Profile error:', err.message);
        return { success: false, message: err.message };
    }
};

export const updateUserProfile = async (profileData) => {
    try {
        const res = await api({
            method: 'PUT',
            url: 'auth/profile',
            data: profileData,
        });
        return res.success ? res.data : { success: false, message: 'Failed to update profile' };
    } catch (err) {
        console.error('Update profile error:', err.message);
        return { success: false, message: err.message };
    }
};

// Admin Dashboard APIs
export const getAdminStats = async () => {
    try {
        const res = await api({ method: 'GET', url: 'admin/stats' });
        return res.success ? res : { success: false, data: null };
    } catch (err) {
        console.error('Admin stats error:', err.message);
        return { success: false, data: null };
    }
};

export const getAdminUsers = async () => {
    try {
        const res = await api({ method: 'GET', url: 'admin/users' });
        return res.success ? res : { success: false, data: [] };
    } catch (err) {
        console.error('Admin users error:', err.message);
        return { success: false, data: [] };
    }
};

export const getAdminAuctions = async () => {
    try {
        const res = await api({ method: 'GET', url: 'admin/auctions' });
        return res.success ? res : { success: false, data: [] };
    } catch (err) {
        console.error('Admin auctions error:', err.message);
        return { success: false, data: [] };
    }
};

export const getAdminCategories = async () => {
    try {
        const res = await api({ method: 'GET', url: 'admin/categories' });
        return res.success ? res : { success: false, data: [] };
    } catch (err) {
        console.error('Admin categories error:', err.message);
        return { success: false, data: [] };
    }
};

// Asset Management APIs
export const getAssets = async () => {
    try {
        const res = await api({ method: 'GET', url: 'assets' });
        return res.success ? res.data : [];
    } catch (err) {
        console.error('Get assets error:', err.message);
        return [];
    }
};

export const createAsset = async (data) => {
    try {
        const res = await api({
            method: 'POST',
            url: 'assets',
            data,
        });
        return res.success ? res.data : { success: false, message: 'Failed to create asset' };
    } catch (err) {
        console.error('Create asset error:', err.message);
        return { success: false, message: err.message };
    }
};

export const updateAsset = async (id, data) => {
    try {
        const res = await api({
            method: 'PUT',
            url: `assets/${id}`,
            data,
        });
        return res.success ? res.data : { success: false, message: 'Failed to update asset' };
    } catch (err) {
        console.error('Update asset error:', err.message);
        return { success: false, message: err.message };
    }
};

export const deleteAsset = async (id) => {
    try {
        const res = await api({
            method: 'DELETE',
            url: `assets/delete/${id}`,
        });
        return res.success ? res.message : { success: false, message: 'Failed to delete asset' };
    } catch (err) {
        console.error('Delete asset error:', err.message);
        return { success: false, message: err.message };
    }
};

// Bidding APIs
export const getCurrentPrice = async (sessionId) => {
    try {
        const res = await api({
            method: 'GET',
            url: `/sessions/${sessionId}/current-price`,
        });
        return { success: true, data: res.data };
    } catch (err) {
        console.error('Get current price error:', err.message);
        return { success: false, data: 0, message: err.message };
    }
};

export const getBidHistory = async (sessionId) => {
    try {
        const res = await api({
            method: 'GET',
            url: `auction/bid-history/${sessionId}`,
        });
        return res.success ? { success: true, data: res.data } : { success: false, data: [], message: res.message };
    } catch (err) {
        console.error('Get bid history error:', err.message);
        return { success: false, data: [], message: err.message };
    }
};

export const placeBid = async (sessionId, bidData) => {
    try {
        const res = await api({
            method: 'POST',
            url: `auction/place-bid/${sessionId}`,
            data: bidData,
        });
        return res.success ? { success: true, data: res.data } : { success: false, message: res.message };
    } catch (err) {
        console.error('Place bid error:', err.message);
        return { success: false, message: err.message };
    }
};

// Home APIs
export const getUpcomingAssets = async () => {
    try {
        const res = await api({ method: 'GET', url: 'home/upcoming-assets' });
        return res.success ? res.data : [];
    } catch (err) {
        console.error('Upcoming assets error:', err.message);
        return [];
    }
};

export const getBanner = async () => {
    try {
        const res = await api({ method: 'GET', url: 'home/banner' });
        return res.success ? res.data : {};
    } catch (err) {
        console.error('Banner error:', err.message);
        return {};
    }
};

export const getPastAuctions = async () => {
    try {
        const res = await api({ method: 'GET', url: 'home/past-auctions' });
        return res.success ? res.data : [];
    } catch (err) {
        console.error('Past auctions error:', err.message);
        return [];
    }
};

export const getNews = async () => {
    try {
        const res = await api({ method: 'GET', url: 'home/news' });
        return res.success ? res.data : [];
    } catch (err) {
        console.error('News error:', err.message);
        return [];
    }
};

export const getPartners = async () => {
    try {
        const res = await api({ method: 'GET', url: 'home/partners' });
        return res.success ? res.data : [];
    } catch (err) {
        console.error('Partners error:', err.message);
        return [];
    }
};

export const getFooterInfo = async () => {
    try {
        const res = await api({ method: 'GET', url: 'home/footer' });
        return res.success
            ? {
                about: res.data.about || '',
                links: Array.isArray(res.data.links) ? res.data.links : [],
                contact: {
                    email: res.data.contact?.email || '',
                    phone: res.data.contact?.phone || '',
                    address: res.data.contact?.address || '',
                },
                social: Array.isArray(res.data.social) ? res.data.social : [],
            }
            : {
                about: '',
                links: [],
                contact: { email: '', phone: '', address: '' },
                social: [],
            };
    } catch (err) {
        console.error('Footer error:', err.message);
        return {
            about: '',
            links: [],
            contact: { email: '', phone: '', address: '' },
            social: [],
        };
    }
};

// Payment APIs
export const getPayments = async () => {
    try {
        const res = await api({ method: 'GET', url: 'payments' });
        return res.success ? res : { success: false, data: [] };
    } catch (err) {
        console.error('Get payments error:', err.message);
        return { success: false, data: [] };
    }
};

export const getRevenue = async (status) => {
    try {
        const res = await api({ method: 'GET', url: `payments/revenue?status=${status}` });
        return res.success ? res : { success: false, data: 0 };
    } catch (err) {
        console.error('Get revenue error:', err.message);
        return { success: false, data: 0 };
    }
};

export const getRevenueByMonth = async (status, month) => {
    try {
        const res = await api({ method: 'GET', url: `payments/revenue/month?status=${status}&month=${month}` });
        return res.success ? res : { success: false, data: 0 };
    } catch (err) {
        console.error('Get revenue by month error:', err.message);
        return { success: false, data: 0 };
    }
};

export default api;