import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { Link } from 'react-router-dom';
import { articleService } from '../../services/articleService';
import { socialService } from '../../services/socialService';
import { eventService } from '../../services/eventService';
import PopupDisplay from '../../components/common/PopupDisplay';
import RollingBanner from '../../components/common/RollingBanner';
import HashtagCloud from '../../components/user/HashtagCloud';
import YouTubeGrid from '../../components/social/YouTubeGrid';
import InstagramGrid from '../../components/social/InstagramGrid';

import ArticleList from '../../components/user/ArticleList';

const MainPage = () => {
    const [latestArticles, setLatestArticles] = useState([]);
    const [recentEvents, setRecentEvents] = useState([]);
    const [socialContent, setSocialContent] = useState({ youtube: [], instagram: [] });
    const [activeSocialTab, setActiveSocialTab] = useState('youtube');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [articlesData, eventsData, youtubeData, instagramData] = await Promise.all([
                    articleService.getArticles(0, 3),
                    eventService.getEvents(0, 3),
                    socialService.getYouTubeContent(0, 3), // 3 items for grid
                    socialService.getInstagramContent(0, 4) // 4 items for grid
                ]);
                setLatestArticles(articlesData.content || []);
                setRecentEvents(eventsData.content || []);
                setSocialContent({
                    youtube: youtubeData.content || [],
                    instagram: instagramData.content || []
                });
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen flex flex-col pt-16">
            <PopupDisplay />
            <Header />

            <main className="flex-1">
                {/* Hero Section / Rolling Banner */}
                <RollingBanner />

                {/* Latest Articles Section */}
                <section className="max-w-[1200px] mx-auto px-6 py-16">
                    <div className="flex justify-between items-end mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">최신 사보</h2>
                        <Link to="/articles" className="text-primary hover:underline font-medium">
                            전체보기 →
                        </Link>
                    </div>

                    <ArticleList
                        articles={latestArticles}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    />

                    {latestArticles.length === 0 && (
                        <div className="text-center py-20 bg-gray-50 rounded-xl text-gray-500 mt-6">
                            등록된 게시물이 없습니다.
                        </div>
                    )}
                </section>

                {/* Social Hub Section */}
                <section className="bg-gray-50 py-16">
                    <div className="max-w-[1200px] mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">소셜 허브</h2>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Tabs */}
                                <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
                                    <button
                                        onClick={() => setActiveSocialTab('youtube')}
                                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${activeSocialTab === 'youtube'
                                            ? 'bg-red-600 text-white shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        YouTube
                                    </button>
                                    <button
                                        onClick={() => setActiveSocialTab('instagram')}
                                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${activeSocialTab === 'instagram'
                                            ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        Instagram
                                    </button>
                                </div>
                                <Link to="/social" className="text-primary hover:underline font-medium text-sm hidden md:block">
                                    전체보기 →
                                </Link>
                            </div>
                        </div>

                        {/* Social Content Grid */}
                        <div className="animate-fade-in">
                            {activeSocialTab === 'youtube' ? (
                                <YouTubeGrid contents={socialContent.youtube} />
                            ) : (
                                <InstagramGrid contents={socialContent.instagram} />
                            )}
                        </div>

                        <div className="mt-8 text-center md:hidden">
                            <Link to="/social" className="text-primary hover:underline font-medium text-sm">
                                전체보기 →
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Ongoing Events Section */}
                <section className="bg-white py-16 border-t border-gray-100">
                    <div className="max-w-[1200px] mx-auto px-6">
                        <div className="flex justify-between items-end mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">진행 중인 이벤트</h2>
                            <Link to="/events" className="text-primary hover:underline font-medium">
                                전체보기 →
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recentEvents.length > 0 ? (
                                recentEvents.map((event) => (
                                    <Link key={event.eventId} to={`/events/${event.eventId}`} className="group block bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                                        <div className="aspect-[16/9] bg-gray-100 relative overflow-hidden">
                                            {event.thumbnailUrl ? (
                                                <img
                                                    src={event.thumbnailUrl}
                                                    alt={event.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                                                    Event Image
                                                </div>
                                            )}
                                            <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-lg text-xs font-bold shadow-md">
                                                {event.isActive ? '진행중' : '종료됨'}
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-1">
                                                {event.title}
                                            </h3>
                                            <p className="text-gray-600 line-clamp-2 mb-4 text-sm">
                                                {event.content?.replace(/<[^>]*>/g, '') || '이벤트 내용이 없습니다.'}
                                            </p>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span>
                                                        {new Date(event.startDate).toLocaleDateString()} ~ {new Date(event.endDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span>{event.location || '온라인'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="col-span-2 text-center py-12 text-gray-400 bg-gray-50 rounded-xl">
                                    진행 중인 이벤트가 없습니다.
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Hashtag Cloud Section */}
                <section className="bg-gray-50 py-16">
                    <div className="max-w-[1200px] mx-auto px-6">
                        <HashtagCloud />
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default MainPage;
