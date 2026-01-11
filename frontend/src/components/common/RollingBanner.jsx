import React, { useState, useEffect, useRef } from 'react';
import { bannerService } from '../../services/bannerService';
import { Link } from 'react-router-dom';

const RollingBanner = () => {
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef(null);

    useEffect(() => {
        fetchBanners();
        return () => resetTimeout();
    }, []);

    useEffect(() => {
        resetTimeout();
        if (banners.length > 1) {
            timeoutRef.current = setTimeout(
                () =>
                    setCurrentIndex((prevIndex) =>
                        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
                    ),
                5000 // 5 seconds auto-slide
            );
        }
        return () => resetTimeout();
    }, [currentIndex, banners.length]);

    const fetchBanners = async () => {
        try {
            const data = await bannerService.getActiveBanners();
            setBanners(data);
        } catch (error) {
            console.error('Failed to fetch banners:', error);
        }
    };

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    };

    if (banners.length === 0) {
        // Fallback or static hero if no banners
        return (
            <div className="bg-gray-100 h-[400px] flex items-center justify-center relative overflow-hidden">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-secondary-darkest mb-4">
                        2026 고려아연 <span className="text-primary">전자사보</span>
                    </h1>
                    <p className="text-lg text-secondary-dark mb-8">
                        임직원 여러분의 이야기를 기다립니다.
                    </p>
                    <Link
                        to="/articles"
                        className="inline-block px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                    >
                        웹진 보기
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-[320px] overflow-hidden group">
            {/* Slides container */}
            <div
                className="w-full h-full flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {banners.map((banner) => (
                    <div
                        key={banner.bannerId}
                        className="w-full h-full flex-shrink-0 relative bg-gray-900"
                    >
                        <img
                            src={banner.imageUrl}
                            alt={banner.title}
                            className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
                            <div className="text-center text-white px-4 w-full max-w-[90%] mx-auto">
                                <h2 className="text-2xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-6 drop-shadow-lg animate-fade-in-up leading-tight">
                                    {banner.title}
                                </h2>
                                {banner.linkUrl && (
                                    <a
                                        href={banner.linkUrl}
                                        target={banner.linkUrl.startsWith('http') ? '_blank' : '_self'}
                                        rel="noreferrer"
                                        className="inline-block px-5 py-2 md:px-8 md:py-3 text-sm md:text-base bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/50 rounded-full font-semibold transition-all mt-2 md:mt-4"
                                    >
                                        자세히 보기
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Buttons (Show on hover, hidden on mobile) */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={nextSlide}
                        className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        {banners.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-3 h-3 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default RollingBanner;
