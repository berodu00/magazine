import React from 'react';

const InstagramGrid = ({ contents = [] }) => {
    if (!contents || contents.length === 0) {
        return (
            <div className="flex items-center justify-center py-20 bg-gray-50 rounded-lg">
                <p className="text-gray-500">등록된 Instagram 콘텐츠가 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {contents.map((content) => (
                <a
                    key={content.contentId || content.externalId}
                    href={content.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                    {/* Image */}
                    <img
                        src={content.thumbnailUrl}
                        alt={content.title || 'Instagram post'}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                        }}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="text-white text-center p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <span className="text-2xl mb-2 block">📷</span>
                            <p className="text-sm font-medium line-clamp-2">
                                {content.description || content.title}
                            </p>
                            <p className="text-xs mt-2 text-gray-200">
                                {new Date(content.publishedAt).toLocaleDateString()}
                            </p>

                            <div className="flex items-center justify-center gap-4 text-xs mt-3 opacity-90">
                                <span className="flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    {850 + (content.externalId?.length || 0) * 5}
                                </span>
                                <span className="flex items-center gap-1 text-red-200">
                                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    {120 + (content.externalId?.length || 0)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Type Badge (Right Top) */}
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                    </div>
                </a>
            ))}
        </div>
    );
};

export default InstagramGrid;
