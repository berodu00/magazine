import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleService } from '../../services/articleService';

const HashtagCloud = () => {
    const [hashtags, setHashtags] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadHashtags();
    }, []);

    const loadHashtags = async () => {
        try {
            const data = await articleService.getPopularHashtags();
            setHashtags(data.hashtags || []);
        } catch (error) {
            console.error('Failed to load hashtags', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTagClick = (tag) => {
        navigate(`/articles?hashtag=${tag}`);
    };

    if (loading || hashtags.length === 0) return null;

    // Simple font size calculation
    const maxCount = Math.max(...hashtags.map(h => h.usageCount));
    const minCount = Math.min(...hashtags.map(h => h.usageCount));

    const getFontSize = (count) => {
        if (maxCount === minCount) return 'text-sm';
        const normalized = (count - minCount) / (maxCount - minCount);
        if (normalized > 0.8) return 'text-lg font-bold';
        if (normalized > 0.5) return 'text-base font-semibold';
        return 'text-sm';
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <span className="text-gray-900 font-bold whitespace-nowrap">인기 키워드</span>
            <div className="flex flex-wrap gap-2">
                {hashtags.map(hashtag => (
                    <button
                        key={hashtag.hashtagId}
                        onClick={() => handleTagClick(hashtag.tagName)}
                        className={`text-gray-500 hover:text-blue-600 hover:underline transition-colors text-sm`}
                    >
                        #{hashtag.tagName}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default HashtagCloud;
