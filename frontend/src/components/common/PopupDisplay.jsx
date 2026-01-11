import React, { useState, useEffect } from 'react';
import { popupService } from '../../services/popupService';
import { useNavigate } from 'react-router-dom';

const PopupDisplay = () => {
    const [popups, setPopups] = useState([]);
    const [currentPopupIndex, setCurrentPopupIndex] = useState(0);
    const [dontShowToday, setDontShowToday] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchActivePopups();
    }, []);

    const fetchActivePopups = async () => {
        try {
            const activePopups = await popupService.getActivePopups();

            // Filter out popups hidden by user
            const visiblePopups = activePopups.filter(popup => {
                const hiddenDate = localStorage.getItem(`hidePopup_${popup.popupId}`);
                if (!hiddenDate) return true;

                const today = new Date().toDateString();
                return hiddenDate !== today;
            });

            setPopups(visiblePopups);
        } catch (error) {
            console.error('Failed to fetch popups:', error);
        }
    };

    const handleClose = () => {
        if (dontShowToday) {
            const today = new Date().toDateString();
            localStorage.setItem(`hidePopup_${popups[currentPopupIndex].popupId}`, today);
        }

        // Move to next popup or close if last one
        if (currentPopupIndex < popups.length - 1) {
            setCurrentPopupIndex(prev => prev + 1);
            setDontShowToday(false);
        } else {
            setPopups([]);
        }
    };

    const handleLinkClick = (url) => {
        if (!url) return;
        if (url.startsWith('http')) {
            window.open(url, '_blank');
        } else {
            navigate(url);
            handleClose(); // Close popup when navigating
        }
    };

    if (popups.length === 0) return null;

    const currentPopup = popups[currentPopupIndex];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 flex justify-between items-center shrink-0">
                    <h3 className="font-bold text-white text-lg truncate flex-1 pr-4">
                        {currentPopup.title}
                    </h3>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {currentPopup.popupType === 'IMAGE' ? (
                        <div
                            className="cursor-pointer hover:opacity-95 transition-opacity"
                            onClick={() => handleLinkClick(currentPopup.linkUrl)}
                        >
                            <img
                                src={currentPopup.imageUrl}
                                alt={currentPopup.title}
                                className="w-full h-auto object-contain"
                            />
                        </div>
                    ) : (
                        <div
                            className="p-6 prose prose-sm max-w-none text-gray-700"
                            onClick={() => handleLinkClick(currentPopup.linkUrl)}
                            dangerouslySetInnerHTML={{ __html: currentPopup.content }}
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-t border-gray-100 shrink-0">
                    <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={dontShowToday}
                            onChange={(e) => setDontShowToday(e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span>오늘 하루 보지 않기</span>
                    </label>

                    <div className="flex items-center gap-2">
                        {popups.length > 1 && (
                            <span className="text-xs text-gray-400 font-medium">
                                {currentPopupIndex + 1} / {popups.length}
                            </span>
                        )}
                        <button
                            onClick={handleClose}
                            className="px-4 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopupDisplay;
