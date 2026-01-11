import api from './api';

export const popupService = {
    getActivePopups: async () => {
        const response = await api.get('/popups/active');
        return response.data;
    },

    getAllPopups: async (page = 0, size = 10) => {
        const response = await api.get('/popups', {
            params: { page, size, sort: 'createdAt,desc' }
        });
        return response.data;
    },

    createPopup: async (popupData) => {
        const response = await api.post('/popups', popupData);
        return response.data;
    },

    updatePopup: async (id, popupData) => {
        const response = await api.put(`/popups/${id}`, popupData);
        return response.data;
    },

    deletePopup: async (id) => {
        const response = await api.delete(`/popups/${id}`);
        return response.data;
    }
};
