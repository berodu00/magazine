import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { socialService } from '../../services/socialService';

const SocialDetailPage = () => {
    const { platform, id } = useParams();
    const navigate = useNavigate();
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                setLoading(true);
                const data = await socialService.getSocialContent(id);
                setContent(data);
            } catch (error) {
                console.error("Failed to fetch social content", error);
                alert("콘텐츠를 불러올 수 없습니다.");
                navigate('/social');
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [id, navigate]);

    if (loading) return (
        <div className="min-h-screen flex flex-col pt-16">
            <Header />
            <div className="flex-1 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
            <Footer />
        </div>
    );

    if (!content) return null;

    // Helper to extract YouTube ID if needed (though backend might provide embed URL or videoId)
    const getYouTubeEmbedUrl = (url) => {
        if (!url) return '';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
    };

    const embedUrl = platform === 'youtube' ? getYouTubeEmbedUrl(content.linkUrl) : null;

    return (
        <div className="min-h-screen flex flex-col pt-16">
            <Header />

            <main className="flex-1 max-w-[800px] w-full mx-auto px-6 py-12">
                {/* Meta Info */}
                <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
                    <span className="uppercase font-semibold tracking-wider text-blue-600">
                        {platform}
                    </span>
                    <span>•</span>
                    <span>{new Date(content.publishedAt).toLocaleDateString()}</span>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
                    {content.title}
                </h1>

                {/* Main Content (Video or Image) */}
                <div className="mb-8 rounded-xl overflow-hidden bg-gray-100 shadow-sm border border-gray-200">
                    {platform === 'youtube' && embedUrl ? (
                        <div className="aspect-video">
                            <iframe
                                width="100%"
                                height="100%"
                                src={embedUrl}
                                title={content.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    ) : (
                        <div className="relative aspect-video">
                            <img
                                src={content.thumbnailUrl}
                                alt={content.title}
                                className="w-full h-full object-cover"
                            />
                            {/* Overlay link for non-embeddable content */}
                            <a
                                href={content.linkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-colors group"
                            >
                                <span className="px-6 py-3 bg-white text-gray-900 rounded-full font-bold shadow-lg transform group-hover:scale-105 transition-transform flex items-center gap-2">
                                    <span>원본 보기</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </span>
                            </a>
                        </div>
                    )}
                </div>

                {/* Description Body */}
                <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed mb-12">
                    <p className="whitespace-pre-line">{content.description}</p>
                </div>

                {/* Navigation */}
                <div className="border-t border-gray-100 pt-12 flex justify-between items-center">
                    <button
                        onClick={() => navigate('/social')}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        목록으로
                    </button>
                    <a
                        href={content.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                    >
                        {platform === 'youtube' ? 'YouTube에서 보기' : '원본 링크'}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </div>

            </main>

            <Footer />
        </div>
    );
};

export default SocialDetailPage;
