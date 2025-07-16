// src/services/homepage.js
import apiClient from './api';

export const homepageAPI = {
    getUpcomingAssets: () => apiClient.get('/home/upcoming-assets'),
    getPastAuctions: () => apiClient.get('/home/past-auctions'),
    getNews: () => apiClient.get('/home/news'),
    getPartners: () => apiClient.get('/home/partners'),
    getFooterInfo: () => apiClient.get('/home/footer'),
};
