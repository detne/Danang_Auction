// src/utils/constants.js
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        PROFILE: '/auth/profile',
        FORGOT_PASSWORD: '/auth/forget-password',
        RESET_PASSWORD: '/auth/reset-password',
    },
    ASSETS: {
        BASE: '/assets',
        SEARCH: '/assets',
        IMAGES: (id) => `/assets/${id}/images`,
        REVIEW: (id) => `/assets/admin/${id}/review`,
    },
    SESSIONS: {
        CURRENT_PRICE: (id) => `/sessions/${id}/current-price`,
        PARTICIPANTS: (id) => `/sessions/${id}/participants`,
        BIDS: (id) => `/sessions/${id}/bids`,
    },
    PARTICIPATIONS: '/participations',
    ADMIN: {
        STATS: '/admin/stats',
        USERS: '/admin/users',
        AUCTIONS: '/admin/auctions',
        CATEGORIES: '/admin/categories',
    },
};

export const USER_ROLES = {
    ADMIN: 'ADMIN',
    ORGANIZER: 'ORGANIZER',
    BIDDER: 'BIDDER',
};

export const AUCTION_STATUS = {
    UPCOMING: 'UPCOMING',
    ACTIVE: 'ACTIVE',
    FINISHED: 'FINISHED',
    CANCELLED: 'CANCELLED',
    APPROVED: 'APPROVED'
};

export const AUCTION_TYPE = {
    PUBLIC: 'PUBLIC',
    PRIVATE: 'PRIVATE',
};

export const AUCTION_DOCUMENT_STATUS = {
    PENDING_CREATE: 'PENDING_CREATE',
    PENDING_APPROVAL: 'PENDING_APPROVAL',
    REJECTED: 'REJECTED',
    APPROVED: 'APPROVED'
}