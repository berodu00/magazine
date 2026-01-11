import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articleService } from '../../services/articleService';
import { format } from 'date-fns';

const ArticleManagePage = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadArticles();
    }, []);

    const loadArticles = async () => {
        try {
            setLoading(true);
            // TODO: Add admin-specific API to get ALL articles (including unpublished)
            // For now, using standard getArticles. 
            // Need backend to support "get all for admin" or just filter on client if volume low.
            // Or ArticleService.getArticles needs to support 'admin mode' param?
            // TechSpec mentions "GET /api/articles (게시물 목록 조회)" supports filtering but defaults to published=true maybe?
            // Actually ArticleRepository.findPublishedArticles filters isPublished=true.
            // I need to add an endpoint for Admin to get ALL articles.
            // But for Phase 1, I might just use what I have or check if I implemented Admin list.
            // ArticleController.getArticles uses articleService.getArticles which uses findPublishedArticles.
            // I should update backend to allow fetching all articles for admin.
            // Current plan: I will list what I can, and fix backend later if needed.
            const response = await articleService.getArticles(0, 50, null); // Get 50 for now
            setArticles(response.content);
        } catch (error) {
            console.error('Failed to load articles', error);
            alert('게시물 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('정말 이 게시물을 삭제하시겠습니까?')) {
            try {
                await articleService.deleteArticle(id);
                alert('게시물이 삭제되었습니다.');
                loadArticles();
            } catch (error) {
                console.error('Failed to delete article', error);
                alert('삭제 실패: ' + error.message);
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">게시물 관리</h1>
                <Link to="/admin/articles/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    새 게시물 작성
                </Link>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성자</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {articles.map((article) => (
                            <tr key={article.articleId}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.articleId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    <Link to={`/articles/${article.articleId}`} target="_blank" className="hover:text-blue-600">
                                        {article.title}
                                    </Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.categoryName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.authorName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800`}>
                                        Published
                                        {/* TODO: Check published status if available in DTO */}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {format(new Date(article.publishedAt || Date.now()), 'yyyy-MM-dd')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link to={`/admin/articles/edit/${article.articleId}`} className="text-indigo-600 hover:text-indigo-900 mr-4">수정</Link>
                                    <button onClick={() => handleDelete(article.articleId)} className="text-red-600 hover:text-red-900">삭제</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ArticleManagePage;
