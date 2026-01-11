import api from './api';

export const articleService = {
    // 게시물 목록 조회
    getArticles: async (page = 0, size = 10, categoryId = null, hashtag = null) => {
        const params = { page, size };
        if (categoryId) params.categoryId = categoryId;
        if (hashtag) params.hashtag = hashtag;

        const response = await api.get('/articles', { params });
        return response.data;
    },

    // 게시물 상세 조회
    getArticle: async (id) => {
        const response = await api.get(`/articles/${id}`);
        return response.data;
    },

    // 게시물 작성 (Admin)
    createArticle: async (articleData) => {
        const response = await api.post('/articles', articleData);
        return response.data;
    },

    // 게시물 수정 (Admin)
    updateArticle: async (id, articleData) => {
        const response = await api.put(`/articles/${id}`, articleData);
        return response.data;
    },

    // 게시물 삭제 (Admin)
    deleteArticle: async (id) => {
        await api.delete(`/articles/${id}`);
    },

    // 카테고리 목록 조회
    getCategories: async () => {
        const response = await api.get('/categories');
        return response.data;
    },

    // 카테고리 생성 (Admin)
    createCategory: async (categoryData) => {
        const response = await api.post('/categories', categoryData);
        return response.data;
    },

    // 인기 해시태그 조회
    getPopularHashtags: async () => {
        const response = await api.get('/hashtags');
        return response.data;
    }
};
