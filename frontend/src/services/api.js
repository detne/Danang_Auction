const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080/api'; // Giữ /api theo cấu hình

// Hàm xây dựng URL hợp lệ
const buildUrl = (path) => {
    return `${API_BASE.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

console.log('API_BASE:', API_BASE);

// Hàm xử lý phản hồi từ API
const handleResponse = async (res) => {
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP error! status: ${res.status} - ${errorText || 'Không có chi tiết lỗi'}`);
    }
    return await res.json();
};

// Hàm lấy header với token
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
        return null;
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
        return null;
    }
};

// Tài sản sắp đấu giá
export const getUpcomingAssets = async () => {
    try {
        const res = await fetch(buildUrl('home/upcoming-assets'), {
            headers: getAuthHeaders(),
        });
        const json = await handleResponse(res);
        return Array.isArray(json) ? json : [];
    } catch (err) {
        console.error('Upcoming assets error:', err.message);
        return [];
    }
};

// Các API khác (tương tự)
export const getBanner = async () => {
    try {
        const res = await fetch(buildUrl('home/banner'), {
            headers: getAuthHeaders(),
        });
        const json = await handleResponse(res);
        return json || {};
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
        const json = await handleResponse(res);
        return Array.isArray(json) ? json : [];
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
        const json = await handleResponse(res);
        return Array.isArray(json) ? json : [];
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
        const json = await handleResponse(res);
        return Array.isArray(json) ? json : [];
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
        const json = await handleResponse(res);
        return {
            about: json.about || '',
            links: Array.isArray(json.links) ? json.links : [],
            contact: {
                email: json.contact?.email || '',
                phone: json.contact?.phone || '',
                address: json.contact?.address || '',
            },
            social: Array.isArray(json.social) ? json.social : [],
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

export const getUserProfile = async (token) => {
    try {
        const res = await fetch(buildUrl('users/profile'), {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token || localStorage.getItem('token')}`,
            },
        });
        return await handleResponse(res);
    } catch (err) {
        console.error('Profile error:', err.message);
        return null;
    }
};