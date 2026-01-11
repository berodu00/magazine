import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import ArticleList from '../../components/user/ArticleList';
import CategoryTabs from '../../components/user/CategoryTabs';
import HashtagCloud from '../../components/user/HashtagCloud';
import { articleService } from '../../services/articleService';
import { useSearchParams } from 'react-router-dom';

const ArticleListPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);

    // URL param Sync
    const categoryIdParam = searchParams.get('categoryId');
    const hashtagParam = searchParams.get('hashtag');
    const activeCategory = categoryIdParam ? parseInt(categoryIdParam) : null;

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchArticles();
    }, [activeCategory, hashtagParam]);

    const fetchCategories = async () => {
        const data = await articleService.getCategories();
        setCategories([{ categoryId: null, name: '전체' }, ...data]);
    };

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const data = await articleService.getArticles(0, 12, activeCategory, hashtagParam);
            setArticles(data.content);
        } catch (error) {
            console.error('Failed to fetch articles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (id) => {
        if (id) {
            setSearchParams({ categoryId: id });
        } else {
            setSearchParams({});
        }
    };

    return (
        <div className="min-h-screen flex flex-col pt-16">
            <Header />

            <main className="max-w-[1200px] mx-auto px-6 py-12 flex-1 w-full">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">웹진</h1>
                    <p className="text-gray-600">고려아연의 다양한 이야기를 전해드립니다.</p>
                </div>

                <CategoryTabs
                    categories={categories}
                    activeCategory={activeCategory}
                    onCategoryChange={handleCategoryChange}
                />

                {hashtagParam && (
                    <div className="mb-6 flex items-center gap-2">
                        <span className="text-gray-600 font-medium">검색 결과:</span>
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold flex items-center gap-2">
                            # {hashtagParam}
                            <button
                                onClick={() => setSearchParams({})}
                                className="hover:text-blue-800"
                            >
                                ✕
                            </button>
                        </span>
                    </div>
                )}

                <div className="mb-12">
                    <HashtagCloud />
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading...</div>
                ) : (
                    <>
                        <ArticleList articles={articles} />
                        {articles.length === 0 && (
                            <div className="text-center py-20 bg-gray-50 rounded-xl text-gray-500">
                                등록된 게시물이 없습니다.
                            </div>
                        )}
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default ArticleListPage;
