import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const NewsletterCreatePage = () => {
    const { user } = useAuth();
    const [subject, setSubject] = useState('');
    const [selectedArticles, setSelectedArticles] = useState(Array(6).fill(null));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSlotIndex, setCurrentSlotIndex] = useState(null);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Fetch articles for selection
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await api.get('/articles', { params: { size: 50, sort: 'publishedAt,desc' } });
                setArticles(response.data.content);
            } catch (err) {
                console.error("Failed to fetch articles", err);
            }
        };
        fetchArticles();
    }, []);

    const openModal = (index) => {
        setCurrentSlotIndex(index);
        setIsModalOpen(true);
    };

    const handleSelectArticle = (article) => {
        const newSelection = [...selectedArticles];
        newSelection[currentSlotIndex] = article;
        setSelectedArticles(newSelection);
        setIsModalOpen(false);
    };

    const handleSend = async () => {
        if (!subject) {
            setError('제목을 입력해주세요.');
            return;
        }
        if (selectedArticles.some(a => a === null)) {
            setError('6개의 기사를 모두 선택해주세요.');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const articleIds = selectedArticles.map(a => a.articleId);
            await api.post('/newsletters', { subject, articleIds });
            setSuccess('뉴스레터가 성공적으로 발송되었습니다.');
            setSubject('');
            setSelectedArticles(Array(6).fill(null));
        } catch (err) {
            setError(err.response?.data?.message || '뉴스레터 발송 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">뉴스레터 생성 및 발송</h1>

            {error && <ErrorMessage message={error} />}
            {success && <div className="bg-green-100 text-green-700 p-4 rounded mb-4">{success}</div>}

            <div className="bg-white p-6 rounded-lg shadow space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">이메일 제목</label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="예: 1월 3주차 고려아연 사보"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">기사 선택 (6개)</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedArticles.map((article, index) => (
                            <div
                                key={index}
                                onClick={() => openModal(index)}
                                className={`border-2 border-dashed rounded-lg p-4 h-48 flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-gray-50
                                    ${article ? 'border-blue-300 bg-blue-50' : 'border-gray-300'}
                                `}
                            >
                                {article ? (
                                    <div className="text-center w-full">
                                        <img src={article.thumbnailUrl} alt={article.title} className="w-full h-24 object-cover rounded mb-2" />
                                        <p className="font-semibold text-sm line-clamp-2">{article.title}</p>
                                    </div>
                                ) : (
                                    <div className="text-gray-400 flex flex-col items-center">
                                        <span className="text-2xl">+</span>
                                        <span className="text-sm">기사 {index + 1} 선택</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        onClick={handleSend}
                        disabled={loading}
                        className={`bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? '발송 중...' : '뉴스레터 발송'}
                    </button>
                </div>
            </div>

            {/* Article Selection Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="font-bold text-lg">기사 선택</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>
                        <div className="p-4 overflow-y-auto flex-1">
                            <div className="grid grid-cols-1 gap-2">
                                {articles.map(article => (
                                    <div
                                        key={article.articleId}
                                        onClick={() => handleSelectArticle(article)}
                                        className="flex items-center gap-3 p-2 border rounded hover:bg-gray-50 cursor-pointer"
                                    >
                                        <img src={article.thumbnailUrl} alt="" className="w-16 h-16 object-cover rounded" />
                                        <div>
                                            <p className="font-bold text-sm">{article.title}</p>
                                            <p className="text-xs text-gray-500">{new Date(article.publishedAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewsletterCreatePage;
