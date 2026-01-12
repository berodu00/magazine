import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { eventService } from '../../services/eventService';

const EventListPage = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await eventService.getEvents();
            setEvents(response.content);
        } catch (err) {
            console.error(err);
            setError('이벤트 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col pt-16">
            <Header />

            <main className="max-w-[1200px] mx-auto px-6 py-12 flex-1 w-full">
                {/* Header Section - Left Aligned */}
                <div className="mb-10 border-b border-gray-100 pb-8 flex flex-col md:flex-row md:items-end gap-2 md:gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">Event</h1>
                    <p className="text-gray-600 md:pb-1">진행 중인 다양한 이벤트에 참여해보세요.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 text-red-500">{error}</div>
                ) : events.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        현재 진행 중인 이벤트가 없습니다.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map(event => (
                            <div
                                key={event.eventId}
                                onClick={() => navigate(`/events/${event.eventId}`)}
                                className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
                            >
                                <div className="aspect-[16/9] bg-gray-100 relative overflow-hidden">
                                    {event.thumbnailUrl ? (
                                        <img
                                            src={event.thumbnailUrl}
                                            alt={event.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                                            Event Image
                                        </div>
                                    )}
                                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold shadow-md ${event.isActive ? 'bg-blue-600 text-white' : 'bg-gray-500 text-white'}`}>
                                        {event.isActive ? '진행중' : '종료됨'}
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors mb-3 line-clamp-2">
                                        {event.title}
                                    </h3>
                                    <div className="flex-1">
                                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                            {event.content?.replace(/<[^>]*>/g, '') || '이벤트 내용이 없습니다.'}
                                        </p>
                                    </div>

                                    <div className="space-y-3 mt-4 pt-4 border-t border-gray-50">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <span>📅</span>
                                            <span>{new Date(event.startDate).toLocaleDateString()} ~ {new Date(event.endDate).toLocaleDateString()}</span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <span>📍</span>
                                            <span>{event.location || '온라인'}</span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <span>👥</span>
                                            <span>{(event.winnerCount || 0) * 10}명 참여 중</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default EventListPage;
