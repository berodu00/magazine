import React from 'react';

const HomepageGrid = ({ contents }) => {
    if (!contents || contents.length === 0) {
        return (
            <div className="col-span-full text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                <p>표시할 보도자료가 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contents.map((item) => (
                <div
                    key={item.contentId}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
                >
                    {/* Thumbnail Image */}
                    <a
                        href={item.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative block aspect-video overflow-hidden bg-gray-100"
                    >
                        {item.thumbnailUrl ? (
                            <img
                                src={item.thumbnailUrl}
                                alt={item.title}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <span className="text-4xl">📰</span>
                            </div>
                        )}
                        <div className="absolute top-3 left-3 bg-blue-900 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
                            Press
                        </div>
                    </a>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-grow">
                        <div className="mb-3">
                            <span className="text-xs text-gray-500">
                                {new Date(item.publishedAt).toLocaleDateString()}
                            </span>
                        </div>

                        <a
                            href={item.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block group-hover:text-blue-700 transition-colors"
                        >
                            <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 leading-tight">
                                {item.title}
                            </h3>
                        </a>

                        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
                            {item.description}
                        </p>

                        <a
                            href={item.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors mt-auto"
                        >
                            원문 보기
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HomepageGrid;
