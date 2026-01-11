import api from './api';

export const eventService = {
    getEvents: async (page = 0, size = 10) => {
        const response = await api.get('/events', {
            params: { page, size }
        });
        return response.data;
    },

    getEvent: async (id) => {
        const response = await api.get(`/events/${id}`);
        return response.data;
    },

    participate: async (id, comment) => {
        await api.post(`/events/${id}/participate`, { comment });
    },

    // Admin methods
    createEvent: async (eventData) => {
        const response = await api.post('/events', eventData);
        return response.data;
    },

    updateEvent: async (id, eventData) => {
        const response = await api.put(`/events/${id}`, eventData);
        return response.data;
    },

    drawWinners: async (id) => {
        const response = await api.post(`/events/${id}/draw-winners`);
        return response.data;
    },

    announceWinners: async (id, announcement) => {
        await api.post(`/events/${id}/announce-winners`, { announcement });
    },

    getParticipants: async (id) => {
        const response = await api.get(`/events/${id}/participants`);
        return response.data;
    }
};
