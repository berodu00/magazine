import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import api from '../../services/api';
import ImageUploader from '../../components/common/ImageUploader';

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
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, eventId: null });

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({
        eventId: null,
        title: '',
        content: '',
        thumbnailUrl: '',
        startDate: '',
        endDate: '',
        winnerCount: 0,
        winnerCount: 0,
        location: '',
        isActive: true
    });

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

    const confirmDelete = (eventId) => {
        setDeleteConfirm({ show: true, eventId });
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/events/${deleteConfirm.eventId}`);
            alert('이벤트가 삭제되었습니다.');
            setDeleteConfirm({ show: false, eventId: null });
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

    // Edit Functions
    const formatDateTimeLocal = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const pad = (num) => String(num).padStart(2, '0');
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const handleEditClick = (event) => {
        setEditFormData({
            eventId: event.eventId,
            title: event.title,
            content: event.content || '',
            thumbnailUrl: event.thumbnailUrl || '',
            startDate: formatDateTimeLocal(event.startDate),
            endDate: formatDateTimeLocal(event.endDate),
            winnerCount: event.winnerCount || 0,
            winnerCount: event.winnerCount || 0,
            location: event.location || '',
            isActive: event.isActive
        });
        setIsEditModalOpen(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...editFormData,
                startDate: editFormData.startDate + ':00', // Append seconds
                endDate: editFormData.endDate + ':00'
            };
            await eventService.updateEvent(editFormData.eventId, payload);
            alert('이벤트가 수정되었습니다.');
            setIsEditModalOpen(false);
            fetchEvents();
        } catch (error) {
            console.error(error);
            alert('이벤트 수정에 실패했습니다.');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">이벤트 관리</h1>
                <button
                    onClick={() => navigate('/admin/events/create')}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                >
                    + 이벤트 생성
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
                                <tr key={event.eventId} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-gray-900">{event.title}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(event.startDate).toLocaleDateString()} ~ {new Date(event.endDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${event.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {event.isActive ? '진행중' : '종료'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleManage(event)}
                                                className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors"
                                            >
                                                참여자 관리
                                            </button>
                                            <button
                                                onClick={() => handleEditClick(event)}
                                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors"
                                            >
                                                수정
                                            </button>
                                            <button
                                                onClick={() => confirmDelete(event.eventId)}
                                                className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors"
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

            {/* Manage Modal (Participants/Winners) */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-up">
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
                                        className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 text-sm font-bold transition-colors"
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
                                                    <th className="pb-2 font-bold">이름</th>
                                                    <th className="pb-2 font-bold">부서</th>
                                                    <th className="pb-2 font-bold">상태</th>
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
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-bold shadow-lg shadow-indigo-200 transition-colors"
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
                                                <span key={w.participantId} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-bold border border-amber-200 flex items-center gap-1">
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
                                    className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors shadow-lg"
                                >
                                    발표하기 ({selectedEvent.winnersAnnounced ? '수정' : '작성'})
                                </button>
                            </section>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-900">이벤트 수정</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">이벤트 제목 *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={editFormData.title}
                                    onChange={handleEditChange}
                                    required
                                    className="block w-full h-12 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors px-4 text-base"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">시작 일시 *</label>
                                    <input
                                        type="datetime-local"
                                        name="startDate"
                                        value={editFormData.startDate}
                                        onChange={handleEditChange}
                                        required
                                        className="block w-full h-12 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors px-4 text-base"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">종료 일시 *</label>
                                    <input
                                        type="datetime-local"
                                        name="endDate"
                                        value={editFormData.endDate}
                                        onChange={handleEditChange}
                                        required
                                        className="block w-full h-12 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors px-4 text-base"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">당첨자 수</label>
                                    <input
                                        type="number"
                                        name="winnerCount"
                                        value={editFormData.winnerCount}
                                        onChange={handleEditChange}
                                        min="0"
                                        className="block w-full h-12 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors px-4 text-base"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">장소/방법</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={editFormData.location}
                                        onChange={handleEditChange}
                                        className="block w-full h-12 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors px-4 text-base"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">썸네일 이미지 *</label>
                                <ImageUploader
                                    currentImage={editFormData.thumbnailUrl}
                                    onUploadSuccess={(fileData) => setEditFormData(prev => ({ ...prev, thumbnailUrl: fileData.url }))}
                                    category="events"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">내용 (HTML 지원)</label>
                                <textarea
                                    name="content"
                                    value={editFormData.content}
                                    onChange={handleEditChange}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors p-4 text-base h-40"
                                    placeholder="이벤트 내용을 입력해주세요."
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors h-11"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 h-11"
                                >
                                    수정 완료
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">이벤트 삭제</h3>
                                    <p className="text-sm text-gray-600 mt-1">정말 삭제하시겠습니까?</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mb-6">
                                이 작업은 되돌릴 수 없습니다.
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setDeleteConfirm({ show: false, eventId: null })}
                                    className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    삭제
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventManagePage;
