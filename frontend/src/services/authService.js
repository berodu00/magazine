import api from './api';

const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        }
    },

    getCurrentUser: () => {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch (error) {
            console.error('Error parsing user from localStorage:', error);
            localStorage.removeItem('user'); // Clean up invalid data
            return null;
        }
    },

    getToken: () => {
        return localStorage.getItem('accessToken');
    }
};

export default authService;
