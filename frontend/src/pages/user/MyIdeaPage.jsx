import React, { useState, useEffect } from 'react';
import { ideaService } from '../../services/ideaService';

const MyIdeaPage = () => {
    const [ideas, setIdeas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyIdeas();
    }, []);

    const fetchMyIdeas = async () => {
        try {
            setLoading(true);
            const response = await ideaService.getMyIdeas();
            setIdeas(response.content || []);
        } catch (error) {
            console.error(error);
            alert('내 아이디어 목록을 불러오지 못했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto px-6 py-10 pt-24">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">내 제안 목록</h1>

            {loading ? (
                <div className="text-center py-20 text-gray-500">로딩중...</div>
            ) : ideas.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl text-gray-500">
                    <div className="text-4xl mb-4">💡</div>
                    <p className="text-lg">아직 제안한 아이디어가 없습니다.</p>
                    <p className="text-sm mt-2">우측 하단 버튼을 눌러 새로운 아이디어를 제안해보세요!</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {ideas.map(idea => (
                        <div key={idea.ideaId} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${idea.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                                            idea.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                idea.status === 'REVIEWED' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {idea.statusDescription}
                                    </span>
                                    <span className="text-gray-400 text-sm">{new Date(idea.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-3">{idea.title}</h3>
                            <p className="text-gray-600 whitespace-pre-wrap mb-4">{idea.content}</p>

                            {idea.adminReply && (
                                <div className="bg-gray-50 rounded-lg p-5 border-l-4 border-gray-300">
                                    <div className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                        <span>💬 관리자 답변</span>
                                    </div>
                                    <p className="text-gray-700">{idea.adminReply}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyIdeaPage;
