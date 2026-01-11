import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { articleService } from '../../services/articleService';
import HtmlEditor from '../../components/editor/HtmlEditor';
import HashtagInput from '../../components/admin/HashtagInput';

const ArticleEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
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
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [categoriesData, articleData] = await Promise.all([
                articleService.getCategories(),
                articleService.getArticle(id)
            ]);

            setCategories(categoriesData);
            setFormData({
                title: articleData.title,
                categoryId: articleData.categoryId,
                content: articleData.content,
                summary: articleData.summary || '',
                thumbnailUrl: articleData.thumbnailUrl || '',
                isPublished: articleData.publishedAt ? true : false,
                hashtags: articleData.hashtags ? articleData.hashtags.map(h => h.tagName) : []
            });
        } catch (error) {
            console.error('Failed to load data', error);
            alert('데이터를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
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

            await articleService.updateArticle(id, {
                ...formData,
                categoryId: Number(formData.categoryId)
            });

            alert('게시물이 수정되었습니다.');
            navigate('/admin/articles');
        } catch (error) {
            console.error('Failed to update article', error);
            alert('수정 실패: ' + error.message);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">게시물 수정</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
                <div>
                    <label className="block text-sm font-medium text-gray-700">제목</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">카테고리</label>
                    <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    >
                        {categories.map(cat => (
                            <option key={cat.categoryId} value={cat.categoryId}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">썸네일 URL</label>
                    <input
                        type="text"
                        name="thumbnailUrl"
                        value={formData.thumbnailUrl}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">요약</label>
                    <textarea
                        name="summary"
                        value={formData.summary}
                        onChange={handleChange}
                        rows={2}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    />
                </div>

                <HashtagInput
                    hashtags={formData.hashtags}
                    onChange={handleHashtagsChange}
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">본문</label>
                    <HtmlEditor value={formData.content} onChange={handleEditorChange} />
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="isPublished"
                        checked={formData.isPublished}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                        바로 발행하기
                    </label>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/articles')}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        수정 완료
                    </button>
                </div>
            </form >
        </div >
    );
};

export default ArticleEditPage;
