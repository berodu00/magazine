import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleService } from '../../services/articleService';
import HtmlEditor from '../../components/editor/HtmlEditor';
import ImageUploader from '../../components/admin/ImageUploader';
import HashtagInput from '../../components/admin/HashtagInput';

const ArticleCreatePage = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        categoryId: '',
        content: '',
        summary: '',
        thumbnailUrl: '',
        isPublished: true,
        hashtags: []
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await articleService.getCategories();
            setCategories(data);
            if (data.length > 0) {
                setFormData(prev => ({ ...prev, categoryId: data[0].categoryId }));
            }
        } catch (error) {
            console.error('Failed to load categories', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleEditorChange = (content) => {
        setFormData(prev => ({ ...prev, content }));
    };

    const handleHashtagsChange = (newTags) => {
        setFormData(prev => ({ ...prev, hashtags: newTags }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!formData.title || !formData.content) {
                alert('제목과 내용은 필수입니다.');
                return;
            }

            await articleService.createArticle({
                ...formData,
                categoryId: Number(formData.categoryId)
            });

            alert('게시물이 작성되었습니다.');
            navigate('/admin/articles');
        } catch (error) {
            console.error('Failed to create article', error);
            alert('작성 실패: ' + error.message);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">새 게시물 작성</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg space-y-8 animate-fade-in-up">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">제목</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="block w-full h-12 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors px-4 text-lg"
                            placeholder="게시물 제목을 입력하세요"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">카테고리</label>
                        <select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            className="block w-full h-12 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors px-4"
                        >
                            {categories.map(cat => (
                                <option key={cat.categoryId} value={cat.categoryId}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">썸네일 이미지</label>
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <ImageUploader
                                category="articles"
                                onUploadSuccess={(url) => setFormData(prev => ({ ...prev, thumbnailUrl: url }))}
                            />
                        </div>
                        {formData.thumbnailUrl && (
                            <div className="w-48">
                                <label className="block text-xs text-gray-400 mb-1">미리보기</label>
                                <img
                                    src={formData.thumbnailUrl}
                                    alt="Thumbnail"
                                    className="w-full rounded-lg shadow-sm border border-gray-200"
                                />
                                <input
                                    type="text"
                                    readOnly
                                    value={formData.thumbnailUrl}
                                    className="mt-2 w-full text-xs text-gray-500 bg-gray-50 border-none rounded"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">요약</label>
                    <textarea
                        name="summary"
                        value={formData.summary}
                        onChange={handleChange}
                        rows={2}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors p-4"
                        placeholder="게시물 목록에 표시될 간단한 요약을 입력하세요"
                    />
                </div>

                <HashtagInput
                    hashtags={formData.hashtags}
                    onChange={handleHashtagsChange}
                />

                <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">본문</label>
                    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                        <HtmlEditor value={formData.content} onChange={handleEditorChange} />
                    </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="isPublished"
                            checked={formData.isPublished}
                            onChange={handleChange}
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            id="publish-check"
                        />
                        <label htmlFor="publish-check" className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer select-none">
                            작성 즉시 발행하기
                        </label>
                    </div>

                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/articles')}
                            className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:shadow-lg"
                        >
                            작성 완료
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ArticleCreatePage;
