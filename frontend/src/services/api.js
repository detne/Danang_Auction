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
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

// Đăng nhập
export const loginUser = async (data) => {
    try {
        const res = await fetch(buildUrl('auth/login'), {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return await handleResponse(res);
    } catch (err) {
        console.error('Login error:', err.message);
        return { success: false, message: err.message };
    }
};

// Đăng ký
export const registerUser = async (data) => {
    try {
        const res = await fetch(buildUrl('auth/register'), {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return await handleResponse(res);
    } catch (err) {
        console.error('Register error:', err.message);
        return { success: false, message: err.message };
    }
};

// Lấy hồ sơ người dùng
export const getUserProfile = async (token) => {
    try {
        const res = await fetch(buildUrl('profile'), {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token || localStorage.getItem('token')}`,
            },
        });
        const data = await handleResponse(res);
        return data.success ? data.data : { success: false, message: 'Invalid profile data' };
    } catch (err) {
        console.error('Profile error:', err.message);
        return { success: false, message: err.message };
    }
};

// Cập nhật hồ sơ người dùng
export const updateUserProfile = async (profileData) => {
    try {
        const res = await fetch(buildUrl('profile'), {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(profileData),
        });
        const data = await handleResponse(res);
        return data.success ? data.data : { success: false, message: 'Failed to update profile' };
    } catch (err) {
        console.error('Update profile error:', err.message);
        return { success: false, message: err.message };
    }
};

// API cho Admin Dashboard
export const getAdminStats = async () => {
    try {
        const res = await fetch(buildUrl('admin/stats'), {
            headers: getAuthHeaders(),
        });
        const data = await handleResponse(res);
        return data.success ? data : { success: false, data: null };
    } catch (err) {
        console.error('Admin stats error:', err.message);
        return { success: false, data: null };
    }
};

export const getAdminUsers = async () => {
    try {
        const res = await fetch(buildUrl('admin/users'), {
            headers: getAuthHeaders(),
        });
        const data = await handleResponse(res);
        return data.success ? data : { success: false, data: [] };
    } catch (err) {
        console.error('Admin users error:', err.message);
        return { success: false, data: [] };
    }
};

export const getAdminAuctions = async () => {
    try {
        const res = await fetch(buildUrl('admin/auctions'), {
            headers: getAuthHeaders(),
        });
        const data = await handleResponse(res);
        return data.success ? data : { success: false, data: [] };
    } catch (err) {
        console.error('Admin auctions error:', err.message);
        return { success: false, data: [] };
    }
};

export const getAdminCategories = async () => {
    try {
        const res = await fetch(buildUrl('admin/categories'), {
            headers: getAuthHeaders(),
        });
        const data = await handleResponse(res);
        return data.success ? data : { success: false, data: [] };
    } catch (err) {
        console.error('Admin categories error:', err.message);
        return { success: false, data: [] };
    }
};

// Các API hiện có
export const getUpcomingAssets = async () => {
    try {
        const res = await fetch(buildUrl('home/upcoming-assets'), {
            headers: getAuthHeaders(),
        });
        const data = await handleResponse(res);
        return data.success ? data.data : [];
    } catch (err) {
        console.error('Upcoming assets error:', err.message);
        return [];
    }
};

export const getBanner = async () => {
    try {
        const res = await fetch(buildUrl('home/banner'), {
            headers: getAuthHeaders(),
        });
        const data = await handleResponse(res);
        return data.success ? data.data : {};
    } catch (err) {
        console.error('Banner error:', err.message);
        return {};
    }
};

export const getPastAuctions = async () => {
    try {
        const res = await fetch(buildUrl('home/past-auctions'), {
            headers: getAuthHeaders(),
        });
        const data = await handleResponse(res);
        return data.success ? data.data : [];
    } catch (err) {
        console.error('Past auctions error:', err.message);
        return [];
    }
};

export const getNews = async () => {
    try {
        const res = await fetch(buildUrl('home/news'), {
            headers: getAuthHeaders(),
        });
        const data = await handleResponse(res);
        return data.success ? data.data : [];
    } catch (err) {
        console.error('News error:', err.message);
        return [];
    }
};

export const getPartners = async () => {
    try {
        const res = await fetch(buildUrl('home/partners'), {
            headers: getAuthHeaders(),
        });
        const data = await handleResponse(res);
        return data.success ? data.data : [];
    } catch (err) {
        console.error('Partners error:', err.message);
        return [];
    }
};

export const getFooterInfo = async () => {
    try {
        const res = await fetch(buildUrl('home/footer'), {
            headers: getAuthHeaders(),
        });
        const data = await handleResponse(res);
        return data.success ? {
            about: data.data.about || '',
            links: Array.isArray(data.data.links) ? data.data.links : [],
            contact: {
                email: data.data.contact?.email || '',
                phone: data.data.contact?.phone || '',
                address: data.data.contact?.address || '',
            },
            social: Array.isArray(data.data.social) ? data.data.social : [],
        } : {
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