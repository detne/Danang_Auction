// src/services/homepage.js
import apiClient from './api';

export const homepageAPI = {
    getUpcomingAuctions: () => apiClient.get('/sessions', {
        params: {
            status: 'UPCOMING',
            type: 'PUBLIC',
        }
    }),
    getPastAuctions: () => apiClient.get('/sessions', {
        params: {
            status: 'FINISHED',
            type: 'PUBLIC',
        }
    }),
    getNews: () => apiClient.get('/home/news'),
    getPartners: () => apiClient.get('/home/partners'),
    getFooterInfo: () => apiClient.get('/home/footer'),
};
