import api from './api';

export const ideaService = {
    createIdea: async (ideaData) => {
        const response = await api.post('/ideas', ideaData);
        return response.data;
    },

    getAllIdeas: async (status = null) => {
        const params = {};
        if (status) params.status = status;

        const response = await api.get('/ideas/admin', { params });
        return response.data;
    },

    getMyIdeas: async () => {
        const response = await api.get('/ideas/my');
        return response.data;
    },

    updateStatus: async (id, statusData) => {
        const response = await api.put(`/ideas/${id}/status`, statusData);
        return response.data;
    }
};
