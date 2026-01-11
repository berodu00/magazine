import api from './api';

export const fileService = {
    // 파일 업로드
    uploadFile: async (file, category = 'common') => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);

        const response = await api.post('/files/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data; // { url: "/uploads/..." }
    }
};
