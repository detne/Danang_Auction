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
    // >>> Thêm hàm này <<<
    getOngoingAuctions: () => apiClient.get('/sessions', {
        params: {
            status: 'ACTIVE', // hoặc 'ONGOING', tùy backend trả về
            type: 'PUBLIC',
        }
    }),
    getNews: () => apiClient.get('/home/news'),
    getPartners: () => apiClient.get('/home/partners'),
    getFooterInfo: () => apiClient.get('/home/footer'),
};
