import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { reactionService } from '../../services/reactionService';
import { useNavigate } from 'react-router-dom';

const REACTION_TYPES = [
    { type: 'LIKE', emoji: '👍', label: '좋아요' },
    { type: 'FUNNY', emoji: '😆', label: '웃겨요' },
    { type: 'SAD', emoji: '😢', label: '슬퍼요' },
    { type: 'ANGRY', emoji: '😡', label: '화나요' },
];

const ReactionButtons = ({ articleId, initialReactions = {}, initialUserReaction = null }) => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Local state for optimistic updates
    const [reactions, setReactions] = useState(initialReactions);
    const [userReaction, setUserReaction] = useState(initialUserReaction);
    const [loading, setLoading] = useState(false);

    const handleReactionClick = async (type) => {
        if (!isAuthenticated) {
            if (window.confirm('로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?')) {
                navigate('/login');
            }
            return;
        }

        if (loading) return;
        setLoading(true);

        try {
            // Optimistic Update Logic
            const isRemoving = userReaction === type;
            let newReactions = { ...reactions };

            if (isRemoving) {
                // Removing existing reaction
                newReactions[type] = Math.max(0, (newReactions[type] || 0) - 1);
                setUserReaction(null);
            } else {
                // Changing or Adding
                if (userReaction) {
                    // Decrement old reaction
                    newReactions[userReaction] = Math.max(0, (newReactions[userReaction] || 0) - 1);
                }
                // Increment new reaction
                newReactions[type] = (newReactions[type] || 0) + 1;
                setUserReaction(type);
            }
            setReactions(newReactions);

            // API Call
            let result;
            if (isRemoving) {
                result = await reactionService.removeReaction(articleId);
            } else {
                result = await reactionService.addOrUpdateReaction(articleId, type);
            }

            // Sync with server response to be sure
            setReactions(result.reactions || {});
            setUserReaction(result.userReaction);

        } catch (error) {
            console.error('Reaction failed:', error);
            // Revert state on error (Simplified: just alert for now, real app would rollback state)
            alert('반응을 저장하는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-2 py-4">
            {REACTION_TYPES.map(({ type, emoji, label }) => {
                const count = reactions[type] || 0;
                const isActive = userReaction === type;

                return (
                    <button
                        key={type}
                        onClick={() => handleReactionClick(type)}
                        className={`
                            group flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-200
                            ${isActive
                                ? 'bg-blue-50 border-blue-200 text-blue-600 ring-2 ring-blue-100'
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'}
                        `}
                        title={label}
                        disabled={loading}
                    >
                        <span className={`text-lg transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                            {emoji}
                        </span>
                        <span className={`text-sm font-medium ${isActive ? 'text-blue-700' : 'text-gray-500'}`}>
                            {count > 0 ? count : ''}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default ReactionButtons;
