import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { eventService } from '../../services/eventService';
import { useAuth } from '../../contexts/AuthContext';

const EventDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth(); // START_VERIFICATION: Changed isLoggedIn to isAuthenticated

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const fetchEvent = async () => {
        try {
            setLoading(true);
            const data = await eventService.getEvent(id);
            setEvent(data);
        } catch (error) {
            console.error(error);
            alert('이벤트 정보를 불러오지 못했습니다.');
            navigate('/events');
        } finally {
            setLoading(false);
        }
    };

    const handleParticipate = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            if (window.confirm('로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?')) {
                navigate('/login');
            }
            return;
        }

        if (!comment.trim()) {
            alert('응원 댓글을 입력해주세요.');
            return;
        }

        if (submitting) return;

        try {
            setSubmitting(true);
            await eventService.participate(id, comment);
            alert('이벤트 참여가 완료되었습니다!');
            fetchEvent(); // Refresh status
            setComment('');
        } catch (error) {
            console.error(error);
            alert('이벤트 참여에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!event) return null;

    return (
        <div className="min-h-screen flex flex-col pt-16">
            <Header />

            <main className="flex-1 max-w-[800px] w-full mx-auto px-6 py-12">
                {/* Header Section */}
                <div className="mb-8 border-b border-gray-100 pb-8">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${event.isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                            {event.isActive ? '진행중' : '종료됨'}
                        </span>
                        <span className="text-gray-500 text-sm">
                            {event.location || '온라인'}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight text-left">
                        {event.title}
                    </h1>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <span className="font-medium text-gray-900">기간</span>
                            <span>{new Date(event.startDate).toLocaleDateString()} ~ {new Date(event.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className="w-px h-3 bg-gray-300"></div>
                        <div className="flex items-center gap-1">
                            <span>{(event.winnerCount || 0) * 10}명 참여 중</span>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="mb-12">
                    {event.thumbnailUrl && (
                        <div className="rounded-2xl overflow-hidden mb-10 shadow-sm border border-gray-100">
                            <img src={event.thumbnailUrl} alt={event.title} className="w-full h-auto object-cover" />
                        </div>
                    )}

                    <div
                        className="prose prose-lg prose-blue max-w-none text-gray-800 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: event.content }}
                    />
                </div>

                {/* Winner Announcement */}
                {event.winnersAnnounced && (
                    <div className="mb-12 p-8 bg-amber-50 rounded-2xl border border-amber-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <span className="text-9xl">🏆</span>
                        </div>
                        <h3 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-2">
                            당첨자 발표
                        </h3>
                        <div className="prose prose-amber max-w-none text-amber-800">
                            <div dangerouslySetInnerHTML={{ __html: event.winnerAnnouncement }} />
                        </div>
                    </div>
                )}

                {/* Participation Form */}
                {event.isActive && (
                    <div className="border-t border-gray-100 pt-12">
                        <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
                            <div className="text-center mb-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">이벤트 참여하기</h3>
                                <p className="text-gray-600 text-sm">응원의 한마디를 남기고 행운의 주인공이 되어보세요!</p>
                            </div>

                            {event.isParticipated ? (
                                <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-blue-100">
                                    <div className="text-4xl mb-3">🎉</div>
                                    <h4 className="text-lg font-bold text-blue-600 mb-1">참여가 완료되었습니다!</h4>
                                    <p className="text-gray-500 text-sm">당첨자 발표를 기다려주세요.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleParticipate} className="max-w-md mx-auto">
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="여기에 내용을 입력해주세요..."
                                        className="w-full h-32 p-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none mb-4 text-sm bg-white"
                                        disabled={submitting}
                                    />
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? '처리중...' : '참여하기'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                )}

                <div className="mt-12 text-center border-t border-gray-100 pt-8">
                    <button onClick={() => navigate('/events')} className="text-gray-500 hover:text-gray-900 font-medium inline-flex items-center gap-2">
                        <span>←</span> 목록으로 돌아가기
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default EventDetailPage;
