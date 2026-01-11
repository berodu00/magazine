import React, { useState } from 'react';

const HashtagInput = ({ hashtags = [], onChange }) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag();
        } else if (e.key === 'Backspace' && !inputValue && hashtags.length > 0) {
            removeTag(hashtags.length - 1);
        }
    };

    const addTag = () => {
        const tag = inputValue.trim().replace(/^#/, '');
        if (tag && !hashtags.includes(tag)) {
            onChange([...hashtags, tag]);
            setInputValue('');
        } else if (tag && hashtags.includes(tag)) {
            setInputValue(''); // Clear duplicate input
        }
    };

    const removeTag = (index) => {
        const newTags = hashtags.filter((_, i) => i !== index);
        onChange(newTags);
    };

    return (
        <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                해시태그
            </label>
            <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-200 focus-within:border-blue-500 bg-white min-h-[48px]">
                {hashtags.map((tag, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                        # {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200 text-blue-600 focus:outline-none"
                        >
                            <span className="sr-only">Remove {tag}</span>
                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={addTag}
                    className="flex-1 min-w-[120px] outline-none border-none focus:ring-0 p-1 text-sm bg-transparent"
                    placeholder="태그 입력 (Enter 또는 콤마)"
                />
            </div>
            <p className="text-xs text-gray-400">
                Tip: 쉼표(,)나 Enter 키를 누르면 태그가 등록됩니다.
            </p>
        </div>
    );
};

export default HashtagInput;
