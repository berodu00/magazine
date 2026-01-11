import api from './api';

export const bannerService = {
    getActiveBanners: async () => {
        const response = await api.get('/banners/active');
        return response.data;
    },

    getAllBanners: async (page = 0, size = 10) => {
        const response = await api.get('/banners', {
            params: { page, size, sort: 'displayOrder,asc' }
        });
        return response.data;
    },

    createBanner: async (bannerData) => {
        const response = await api.post('/banners', bannerData);
        return response.data;
    },

    updateBanner: async (id, bannerData) => {
        const response = await api.put(`/banners/${id}`, bannerData);
        return response.data;
    },

    deleteBanner: async (id) => {
        const response = await api.delete(`/banners/${id}`);
        return response.data;
    }
};
