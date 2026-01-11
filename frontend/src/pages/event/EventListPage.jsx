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
                <div className="mb-8 flex items-baseline gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">Event</h1>
                    <p className="text-gray-600">진행 중인 다양한 이벤트에 참여해보세요.</p>
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
                                className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
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
                                    <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-lg text-xs font-bold shadow-md">
                                        {event.isActive ? '진행중' : '종료됨'}
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors mb-3">
                                        {event.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm line-clamp-2 mb-6 flex-1">
                                        {event.content?.replace(/<[^>]*>/g, '') || '이벤트 내용이 없습니다.'}
                                    </p>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-start gap-3 text-sm text-gray-600">
                                            <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <div>
                                                <span>{new Date(event.startDate).toLocaleDateString()} ~ {new Date(event.endDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 text-sm text-gray-600">
                                            <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <div>
                                                <span>{event.location || '온라인'}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <span>{(event.winnerCount || 0) * 10}명 참여 중</span>
                                        </div>
                                    </div>

                                    <button className="w-full bg-secondary-darkest text-white py-3 rounded-lg font-bold hover:bg-primary transition-colors duration-300">
                                        참여 신청
                                    </button>
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
