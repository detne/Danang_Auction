const API_BASE = process.env.REACT_APP_API_BASE;

console.log('API_BASE:', API_BASE);

const handleResponse = async (res) => {
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
};

// Đăng nhập
export const loginUser = async (data) => {
    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return await handleResponse(res);
    } catch (err) {
        console.error('Login error:', err);
        return null;
    }
};

// Đăng ký
export const registerUser = async (data) => {
    try {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return await handleResponse(res);
    } catch (err) {
        console.error('Register error:', err);
        return null;
    }
};

// Tài sản sắp đấu giá
export const getUpcomingAssets = async () => {
    try {
        const res = await fetch(`${API_BASE}/home/upcoming-assets`);
        const json = await handleResponse(res);
        return Array.isArray(json) ? json : [];
    } catch (err) {
        console.error('Upcoming assets error:', err);
        return [];
    }
};

// Tin tức
export const getNews = async () => {
    try {
        const res = await fetch(`${API_BASE}/home/news`);
        const json = await handleResponse(res);
        return Array.isArray(json) ? json : [];
    } catch (err) {
        console.error('News error:', err);
        return [];
    }
};

// Đối tác
export const getPartners = async () => {
    try {
        const res = await fetch(`${API_BASE}/home/partners`);
        const json = await handleResponse(res);
        return Array.isArray(json) ? json : [];
    } catch (err) {
        console.error('Partners error:', err);
        return [];
    }
};

// Tài sản đã đấu giá
export const getPastAuctions = async () => {
    try {
        const res = await fetch(`${API_BASE}/home/past-auctions`);
        const json = await handleResponse(res);
        return Array.isArray(json) ? json : [];
    } catch (err) {
        console.error('Past auctions error:', err);
        return [];
    }
};

// Banner
export const getBanner = async () => {
    try {
        const res = await fetch(`${API_BASE}/home/banner`);
        const json = await handleResponse(res);
        return json || {};
    } catch (err) {
        console.error('Banner error:', err);
        return {};
    }
};

// Thông tin footer
export const getFooterInfo = async () => {
    try {
        const res = await fetch(`${API_BASE}/home/footer`);
        const json = await handleResponse(res);

        // Fallback để không lỗi .map trong Footer
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
        console.error('Footer error:', err);
        return {
            about: '',
            links: [],
            contact: { email: '', phone: '', address: '' },
            social: [],
        };
    }
};

// Hồ sơ người dùng
export const getUserProfile = async (token) => {
    try {
        const res = await fetch(`${API_BASE}/users/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return await handleResponse(res);
    } catch (err) {
        console.error('Profile error:', err);
        return null;
    }
};