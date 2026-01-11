import React, { useState, useEffect } from 'react';
import { ideaService } from '../../services/ideaService';

const IdeaManagePage = () => {
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    const [selectedIdea, setSelectedIdea] = useState(null);
    const [editStatus, setEditStatus] = useState('');
    const [editReply, setEditReply] = useState('');

    useEffect(() => {
        fetchIdeas();
    }, [filter]);

    const fetchIdeas = async () => {
        try {
            setLoading(true);
            const response = await ideaService.getAllIdeas(filter || null);
            setIdeas(response.content);
        } catch (error) {
            console.error(error);
            alert('아이디어 목록을 불러오지 못했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const openStatusModal = (idea) => {
        setSelectedIdea(idea);
        setEditStatus(idea.status);
        setEditReply(idea.adminReply || '');
    };

    const closeStatusModal = () => {
        setSelectedIdea(null);
        setEditStatus('');
        setEditReply('');
    };

    const handleSaveStatus = async () => {
        if (!selectedIdea) return;

        try {
            await ideaService.updateStatus(selectedIdea.ideaId, {
                status: editStatus,
                adminReply: editReply
            });
            alert('상태가 변경되었습니다.');
            fetchIdeas();
            closeStatusModal();
        } catch (error) {
            console.error(error);
            alert('상태 변경에 실패했습니다.');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">아이디어 관리</h1>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm"
                >
                    <option value="">전체 상태</option>
                    <option value="PENDING">대기중</option>
                    <option value="REVIEWED">검토중</option>
                    <option value="ACCEPTED">채택됨</option>
                    <option value="REJECTED">반려됨</option>
                </select>
            </div>

            <div className="grid gap-6">
                {loading ? (
                    <div className="text-center py-10">로딩중...</div>
                ) : ideas.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">등록된 아이디어가 없습니다.</div>
                ) : (
                    ideas.map(idea => (
                        <div key={idea.ideaId} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${idea.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                                            idea.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                idea.status === 'REVIEWED' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {idea.statusDescription}
                                        </span>
                                        <span className="text-gray-400 text-sm">{new Date(idea.createdAt).toLocaleDateString()}</span>
                                        <span className="text-gray-500 text-sm font-medium">by {idea.authorName}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">{idea.title}</h3>
                                </div>
                                <button
                                    onClick={() => openStatusModal(idea)}
                                    className="px-3 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                                >
                                    상태 변경
                                </button>
                            </div>

                            <p className="text-gray-600 mb-4 whitespace-pre-wrap">{idea.content}</p>

                            {idea.adminReply && (
                                <div className="bg-gray-50 rounded-lg p-4 text-sm border-l-4 border-gray-300">
                                    <span className="font-bold text-gray-900 block mb-1">관리자 답변:</span>
                                    <span className="text-gray-600">{idea.adminReply}</span>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Status Change Modal */}
            {selectedIdea && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={closeStatusModal} />
                    <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 animate-fade-in">
                        <h3 className="text-xl font-bold mb-4">상태 변경</h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
                            <select
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="PENDING">대기중</option>
                                <option value="REVIEWED">검토중</option>
                                <option value="ACCEPTED">채택됨</option>
                                <option value="REJECTED">반려됨</option>
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">관리자 답변</label>
                            <textarea
                                value={editReply}
                                onChange={(e) => setEditReply(e.target.value)}
                                className="w-full h-24 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                placeholder="답변을 입력하세요..."
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={closeStatusModal}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSaveStatus}
                                className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                저장
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IdeaManagePage;
