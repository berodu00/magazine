import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { socialService } from '../../services/socialService';
import YouTubeGrid from '../../components/social/YouTubeGrid';
import InstagramGrid from '../../components/social/InstagramGrid';
import HomepageGrid from '../../components/social/HomepageGrid';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const SocialPage = () => {
    const [activeTab, setActiveTab] = useState('youtube');
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchContents(activeTab);
    }, [activeTab]);

    const fetchContents = async (platform) => {
        try {
            setLoading(true);
            setError(null);
            let response;
            if (platform === 'youtube') {
                response = await socialService.getYouTubeContent(0, 9);
            } else if (platform === 'instagram') {
                response = await socialService.getInstagramContent(0, 12);
            } else if (platform === 'homepage') {
                response = await socialService.getHomepageContent(0, 9);
            }
            setContents(response.content || []);
        } catch (err) {
            console.error('Failed to fetch social content:', err);
            setError('콘텐츠를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'youtube', label: 'YouTube', icon: '▶' },
        { id: 'instagram', label: 'Instagram', icon: '📷' },
        { id: 'homepage', label: '최신 소식', icon: '📰' }
    ];

    return (
        <div className="min-h-screen flex flex-col pt-16">
            <Header />

            <main className="max-w-[1200px] mx-auto px-6 py-12 flex-1 w-full">
                {/* Header */}
                <div className="mb-8 flex items-baseline gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">소셜 허브</h1>
                    <p className="text-gray-600">고려아연의 최신 소셜 미디어 소식과 보도자료를 확인하세요.</p>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm w-fit mb-8 border border-gray-100">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                                ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }
                            `}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <LoadingSpinner />
                    </div>
                ) : error ? (
                    <ErrorMessage message={error}>
                        <button
                            onClick={() => fetchContents(activeTab)}
                            className="ml-4 underline hover:text-red-800"
                        >
                            재시도
                        </button>
                    </ErrorMessage>
                ) : (
                    <div className="animate-fade-in">
                        {activeTab === 'youtube' && <YouTubeGrid contents={contents} />}
                        {activeTab === 'instagram' && <InstagramGrid contents={contents} />}
                        {activeTab === 'homepage' && <HomepageGrid contents={contents} />}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default SocialPage;
