import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import api from '../../services/api';

const EventManagePage = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [announcement, setAnnouncement] = useState('');
    const [winners, setWinners] = useState([]);
    const [isDrawLoading, setIsDrawLoading] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await api.get('/events/admin');
            setEvents(response.data.content);
        } catch (error) {
            console.error(error);
            alert('이벤트 목록을 불러오지 못했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        try {
            await api.delete(`/events/${id}`);
            alert('이벤트가 삭제되었습니다.');
            fetchEvents();
        } catch (error) {
            console.error(error);
            alert('삭제에 실패했습니다.');
        }
    };

    const handleManage = async (event) => {
        try {
            setSelectedEvent(event);
            setAnnouncement(event.winnerAnnouncement || '');
            const parts = await eventService.getParticipants(event.eventId);
            setParticipants(parts);
            setWinners(parts.filter(p => p.isWinner));
        } catch (error) {
            console.error(error);
            alert('참여자 정보를 불러오는데 실패했습니다.');
        }
    };

    const closeManageModal = () => {
        setSelectedEvent(null);
        setParticipants([]);
        setWinners([]);
    };

    const handleDownloadCSV = () => {
        if (participants.length === 0) {
            alert('참여자가 없습니다.');
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // BOM for Excel
        csvContent += "ID,이름,부서,댓글,당첨여부\n";

        participants.forEach(p => {
            const row = [
                p.userId,
                p.userName,
                p.department,
                `"${(p.comment || '').replace(/"/g, '""')}"`, // Escape quotes
                p.isWinner ? '당첨' : '-'
            ].join(",");
            csvContent += row + "\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${selectedEvent.title}_participants.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDrawWinners = async () => {
        if (!window.confirm(`${selectedEvent.winnerCount}명의 당첨자를 추첨하시겠습니까?\n기존 당첨자는 초기화됩니다.`)) return;

        try {
            setIsDrawLoading(true);
            const newWinners = await eventService.drawWinners(selectedEvent.eventId);
            setWinners(newWinners);
            // Update participants list to reflect new winners
            const updatedParticipants = participants.map(p => ({
                ...p,
                isWinner: newWinners.some(w => w.participantId === p.participantId)
            }));
            setParticipants(updatedParticipants);
            alert('추첨이 완료되었습니다!');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || '추첨에 실패했습니다.');
        } finally {
            setIsDrawLoading(false);
        }
    };

    const handleAnnounce = async () => {
        if (!announcement.trim()) {
            alert('발표 내용을 입력해주세요.');
            return;
        }
        if (!window.confirm('당첨자를 발표하시겠습니까?')) return;

        try {
            await eventService.announceWinners(selectedEvent.eventId, announcement);
            alert('발표가 완료되었습니다.');
            closeManageModal();
            fetchEvents();
        } catch (error) {
            console.error(error);
            alert('발표에 실패했습니다.');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">이벤트 관리</h1>
                <button
                    onClick={() => navigate('/admin/events/create')}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    이벤트 생성
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">제목</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">기간</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">상태</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="4" className="px-6 py-4 text-center">로딩중...</td></tr>
                        ) : events.length === 0 ? (
                            <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">등록된 이벤트가 없습니다.</td></tr>
                        ) : (
                            events.map(event => (
                                <tr key={event.eventId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{event.title}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(event.startDate).toLocaleDateString()} ~ {new Date(event.endDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${event.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {event.isActive ? '진행중' : '종료'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleManage(event)}
                                                className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-200"
                                            >
                                                관리
                                            </button>
                                            <button
                                                onClick={() => handleDelete(event.eventId)}
                                                className="text-red-500 hover:text-red-700 text-sm font-medium px-2"
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Manage Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-gray-900">이벤트 관리: {selectedEvent.title}</h2>
                            <button onClick={closeManageModal} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                        </div>

                        <div className="p-6 space-y-8">
                            {/* Section 1: Participants & CSV */}
                            <section>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        👥 참여자 목록 <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-sm">{participants.length}명</span>
                                    </h3>
                                    <button
                                        onClick={handleDownloadCSV}
                                        className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 text-sm font-medium transition-colors"
                                    >
                                        Excel 다운로드
                                    </button>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 max-h-40 overflow-y-auto text-sm border border-gray-100">
                                    {participants.length === 0 ? (
                                        <p className="text-gray-500 text-center py-2">아직 참여자가 없습니다.</p>
                                    ) : (
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="text-gray-500 border-b border-gray-200">
                                                    <th className="pb-2">이름</th>
                                                    <th className="pb-2">부서</th>
                                                    <th className="pb-2">상태</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {participants.map(p => (
                                                    <tr key={p.participantId} className="border-b border-gray-100 last:border-0 hover:bg-gray-100/50">
                                                        <td className="py-2">{p.userName}</td>
                                                        <td className="py-2 text-gray-500">{p.department}</td>
                                                        <td className="py-2">
                                                            {p.isWinner && <span className="text-amber-600 font-bold">👑 당첨</span>}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </section>

                            {/* Section 2: Draw Winners */}
                            <section className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold text-indigo-900">🎲 당첨자 추첨</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-indigo-700">총 <b>{selectedEvent.winnerCount}</b>명 선정</span>
                                        <button
                                            onClick={handleDrawWinners}
                                            disabled={isDrawLoading || participants.length === 0}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-bold shadow-lg shadow-indigo-200"
                                        >
                                            {isDrawLoading ? '추첨 중...' : '추첨 시작'}
                                        </button>
                                    </div>
                                </div>

                                {winners.length > 0 && (
                                    <div className="bg-white rounded-lg p-4 border border-indigo-100 shadow-sm">
                                        <h4 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">당첨자 명단</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {winners.map(w => (
                                                <span key={w.participantId} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium border border-amber-200 flex items-center gap-1">
                                                    👑 {w.userName}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* Section 3: Announce */}
                            <section>
                                <h3 className="text-lg font-bold text-gray-800 mb-4">📢 당첨자 발표</h3>
                                <textarea
                                    value={announcement}
                                    onChange={(e) => setAnnouncement(e.target.value)}
                                    placeholder="발표 내용을 입력하세요 (HTML 지원)"
                                    className="w-full h-32 p-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-mono text-sm mb-4"
                                />
                                <button
                                    onClick={handleAnnounce}
                                    className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
                                >
                                    발표하기 ({selectedEvent.winnersAnnounced ? '수정' : '작성'})
                                </button>
                            </section>
                        </div>
                    </div>
                </div>
            )}        </div>
    );
};

export default EventManagePage;
