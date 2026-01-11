import React, { useState } from 'react';
import { ideaService } from '../../services/ideaService';

const IdeaFloatingButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({ title: '', content: '' });
    const [submitting, setSubmitting] = useState(false);

    const toggleModal = () => setIsOpen(!isOpen);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.content.trim()) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        try {
            setSubmitting(true);
            await ideaService.createIdea(formData);
            alert('소중한 아이디어가 전달되었습니다.\n검토 후 반영하겠습니다!');
            setFormData({ title: '', content: '' });
            setIsOpen(false);
        } catch (error) {
            console.error(error);
            alert('아이디어 전송에 실패했습니다.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={toggleModal}
                className="fixed bottom-8 right-8 z-40 bg-yellow-400 text-white rounded-full p-4 shadow-lg hover:bg-yellow-500 hover:scale-110 transition-all duration-300 group"
                title="아이디어 제안"
            >
                <svg className="w-8 h-8 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    아이디어 제안
                </span>
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={toggleModal} />

                    <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg shadow-2xl p-6 transform transition-all animate-slide-up sm:animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <span className="text-2xl">💡</span>
                                아이디어 제안
                            </h3>
                            <button onClick={toggleModal} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                                    placeholder="어떤 아이디어인가요?"
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    className="w-full h-32 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all resize-none"
                                    placeholder="자세한 내용을 들려주세요."
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3 bg-yellow-400 text-white font-bold rounded-xl hover:bg-yellow-500 transition-colors shadow-lg shadow-yellow-100 disabled:opacity-50"
                            >
                                {submitting ? '전송 중...' : '아이디어 보내기'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default IdeaFloatingButton;
