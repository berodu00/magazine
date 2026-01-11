import api from './api';

export const socialService = {
    getYouTubeContent: async (page = 0, size = 9) => {
        const response = await api.get('/social/youtube', {
            params: { page, size }
        });
        return response.data;
    },

    getInstagramContent: async (page = 0, size = 9) => {
        const response = await api.get('/social/instagram', {
            params: { page, size }
        });
        return response.data;
    },

    getHomepageContent: async (page = 0, size = 9) => {
        const response = await api.get('/social/homepage', {
            params: { page, size }
        });
        return response.data;
    },

    getSocialContent: async (id) => {
        const response = await api.get(`/social/${id}`);
        return response.data;
    }
};
