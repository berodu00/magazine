import api from './api';

export const ratingService = {
    /**
     * Add or update a rating
     * @param {number} articleId 
     * @param {number} score 1-5
     * @returns {Promise<Object>} RatingResponseDto
     */
    addOrUpdateRating: async (articleId, score) => {
        const response = await api.post(`/articles/${articleId}/ratings`, { score });
        return response.data;
    }
};
