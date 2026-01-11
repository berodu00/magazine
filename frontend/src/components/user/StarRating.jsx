import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ratingService } from '../../services/ratingService';
import { useNavigate } from 'react-router-dom';

const StarRating = ({ articleId, initialRating = 0, initialUserRating = null, totalRatings = 0, averageRating = 0 }) => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // UI state
    const [hoverRating, setHoverRating] = useState(0);
    const [userRating, setUserRating] = useState(initialUserRating);
    const [stats, setStats] = useState({ average: averageRating || 0, total: totalRatings || 0 });
    const [loading, setLoading] = useState(false);

    const handleRatingClick = async (score) => {
        if (!isAuthenticated) {
            if (window.confirm('로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?')) {
                navigate('/login');
            }
            return;
        }

        if (loading) return;
        setLoading(true);

        try {
            // Optimistic Update
            setUserRating(score);

            // API Call
            const result = await ratingService.addOrUpdateRating(articleId, score);

            // Update stats from server
            setStats({
                average: result.averageRating,
                total: result.totalRatings
            });
            setUserRating(result.userRating);

        } catch (error) {
            console.error('Rating failed:', error);
            alert('별점 등록 중 오류가 발생했습니다.');
            setUserRating(initialUserRating); // Revert
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-2 py-4">
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingClick(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        disabled={loading}
                        className="p-1 focus:outline-none transition-transform hover:scale-110"
                    >
                        <svg
                            className={`w-8 h-8 ${(hoverRating || userRating) >= star
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300 fill-current'
                                }`}
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                    </button>
                ))}
            </div>

            <div className="text-sm text-gray-500 font-medium">
                평점 <span className="text-gray-900 text-lg font-bold">{stats.average.toFixed(1)}</span>
                <span className="mx-1">/</span>
                <span className="text-xs">({stats.total}명 참여)</span>
            </div>

            {userRating && (
                <div className="text-xs text-blue-600">
                    참여해 주셔서 감사합니다!
                </div>
            )}
        </div>
    );
};

export default StarRating;
