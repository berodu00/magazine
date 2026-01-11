import React from 'react';

const YouTubeGrid = ({ contents = [] }) => {
    if (!contents || contents.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                등록된 YouTube 콘텐츠가 없습니다.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contents.map((item) => (
                <a
                    key={item.contentId}
                    href={`/social/youtube/${item.contentId}`}
                    className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                    <div className="relative aspect-video bg-gray-100 overflow-hidden">
                        <img
                            src={item.thumbnailUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all">
                                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="p-4">
                        <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                            {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {item.description}
                        </p>

                        <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
                            <div className="flex items-center gap-2">
                                <span>YouTube</span>
                                <span>•</span>
                                <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    {1250 + (item.contentId || 0) * 10}
                                </span>
                                <span className="flex items-center gap-1 text-red-400">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    {45 + (item.contentId || 0)}
                                </span>
                            </div>
                        </div>
                    </div>
                </a>
            ))}
        </div>
    );
};

export default YouTubeGrid;
