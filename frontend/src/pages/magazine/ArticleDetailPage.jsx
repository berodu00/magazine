import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { articleService } from '../../services/articleService';
import ReactionButtons from '../../components/user/ReactionButtons';
import StarRating from '../../components/user/StarRating';

const ArticleDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mock Data integration for testing UI
    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const data = await articleService.getArticle(id);
                setArticle(data);
            } catch (error) {
                console.error('Failed to fetch article:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchArticle();
        }
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!article) return <div>Article not found</div>;

    return (
        <div className="min-h-screen flex flex-col pt-16">
            <Header />

            <main className="max-w-[800px] mx-auto px-6 py-12 flex-1 w-full">
                {/* Meta */}
                <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-primary-lightest text-primary text-sm font-semibold rounded-full">
                        {article.categoryName}
                    </span>
                    <span className="text-secondary-medium text-sm">{new Date(article.publishedAt).toLocaleDateString()}</span>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
                    {article.title}
                </h1>

                {/* Author & Stats */}
                <div className="flex items-center justify-between pb-8 border-b border-gray-100 mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xs">
                            IMG
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-900">{article.authorName}</div>
                            <div className="text-xs text-gray-500">커뮤니케이션팀</div>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500 flex gap-4">
                        <span>조회 {article.viewCount}</span>
                    </div>
                </div>

                {/* Content */}
                <div
                    className="prose prose-lg max-w-none prose-img:rounded-xl prose-headings:text-secondary-darkest prose-a:text-primary"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* Hashtags */}
                {article.hashtags && article.hashtags.length > 0 && (
                    <div className="mt-8 flex flex-wrap gap-2">
                        {article.hashtags.map((tag) => (
                            <button
                                key={tag.hashtagId}
                                onClick={() => navigate(`/magazine?hashtag=${tag.tagName}`)}
                                className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-full text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                                # {tag.tagName}
                            </button>
                        ))}
                    </div>
                )}

                {/* Reactions */}
                <div className="mt-8 flex justify-center">
                    <ReactionButtons
                        articleId={article.articleId}
                        initialReactions={article.reactions}
                        initialUserReaction={article.userReaction}
                    />
                </div>

                {/* Rating */}
                <div className="mt-4 flex justify-center pb-8 border-b border-gray-100">
                    <StarRating
                        articleId={article.articleId}
                        initialRating={0}
                        initialUserRating={article.userRating}
                        totalRatings={article.totalRatings}
                        averageRating={article.averageRating}
                    />
                </div>

                {/* Back Button */}
                <div className="mt-16 pt-8 border-t border-gray-100 text-center">
                    <button
                        onClick={() => navigate('/articles')}
                        className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                        목록으로 돌아가기
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ArticleDetailPage;
