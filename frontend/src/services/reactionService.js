import api from './api';

export const reactionService = {
    /**
     * Add or update a reaction
     * @param {number} articleId 
     * @param {string} reactionType 'LIKE', 'SAD', 'ANGRY', 'FUNNY'
     * @returns {Promise<Object>} ReactionSummaryDto
     */
    addOrUpdateReaction: async (articleId, reactionType) => {
        constresponse = await api.post(`/articles/${articleId}/reactions`, { reactionType });
        return response.data;
    },

    /**
     * Remove a reaction
     * @param {number} articleId 
     * @returns {Promise<Object>} ReactionSummaryDto
     */
    removeReaction: async (articleId) => {
        const response = await api.delete(`/articles/${articleId}/reactions`);
        return response.data;
    }
};
