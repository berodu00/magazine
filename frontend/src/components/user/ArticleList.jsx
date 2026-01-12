import React from 'react';
import { Link } from 'react-router-dom';

const ArticleList = ({ articles, className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" }) => {
    // Mock Data Fallback
    const displayArticles = articles;

    const getCategoryBadgeClass = (categoryName) => {
        switch (categoryName) {
            case 'Special': return 'bg-primary-lightest text-primary';
            case 'People': return 'bg-accent-teal-light/50 text-accent-teal'; // Adjusted opacity for better contrast if needed, or just use the color
            case 'Life': return 'bg-accent-gold-light/50 text-accent-gold'; // Gold text on light gold bg
            default: return 'bg-secondary-lightest text-secondary-medium';
        }
    };

    return (
        <div className={className}>
            {displayArticles.map((article) => (
                <div key={article.articleId} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 group cursor-pointer">
                    <Link to={`/articles/${article.articleId}`}>
                        <div className="aspect-video bg-secondary-light relative">
                            {article.thumbnailUrl ? (
                                <img src={article.thumbnailUrl} alt={article.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-secondary-medium">
                                    No Image
                                </div>
                            )}
                            {/* Category Badge Text Overlay */}
                            <div className="absolute top-4 left-4">
                                <span className={`px-3 py-1 text-xs font-bold rounded-full text-white shadow-sm ${article.categoryName === 'Special' ? 'bg-primary' :
                                    article.categoryName === 'People' ? 'bg-accent-teal' :
                                        article.categoryName === 'Life' ? 'bg-accent-gold' : 'bg-gray-800'
                                    }`}>
                                    {article.categoryName}
                                </span>
                            </div>
                        </div>
                        <div className="p-5">
                            {/* Hashtags instead of Category Badge here */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                {['#KoreaZinc', '#Sustainability', '#Innovation'].slice(0, 2).map((tag, i) => (
                                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] rounded-md">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <h3 className="text-lg font-bold text-secondary-darkest mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                {article.title}
                            </h3>
                            <p className="text-sm text-secondary-medium line-clamp-2 mb-4">
                                {article.summary}
                            </p>
                            <div className="flex items-center justify-between text-xs text-secondary-medium pt-4 border-t border-secondary-lightest">
                                <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        {article.viewCount}
                                    </span>
                                    <span className="flex items-center gap-1 text-red-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                        {article.likeCount || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default ArticleList;
