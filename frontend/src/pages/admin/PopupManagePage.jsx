import React, { useState, useEffect } from 'react';
import { popupService } from '../../services/popupService';
import ImageUploader from '../../components/common/ImageUploader';
import { fileService } from '../../services/fileService';
import HtmlEditor from '../../components/editor/HtmlEditor';

const PopupManagePage = () => {
    const [popups, setPopups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        popupType: 'IMAGE',
        imageUrl: '',
        content: '',
        linkUrl: '',
        displayOrder: 0,
        isActive: true,
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        fetchPopups();
    }, []);

    const fetchPopups = async () => {
        try {
            setLoading(true);
            const response = await popupService.getAllPopups();
            setPopups(response.content);
        } catch (error) {
            console.error(error);
            alert('팝업 목록을 불러오지 못했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleEditorChange = (content) => {
        setFormData(prev => ({ ...prev, content }));
    };

    const handleImageUpload = (fileData) => {
        setFormData(prev => ({ ...prev, imageUrl: fileData.filePath }));
    };

    const openCreateModal = () => {
        setIsEditing(false);
        setFormData({
            title: '',
            popupType: 'IMAGE',
            imageUrl: '',
            content: '',
            linkUrl: '',
            displayOrder: 0,
            isActive: true,
            startDate: new Date().toISOString().slice(0, 16),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
        });
        setIsModalOpen(true);
    };

    const openEditModal = (popup) => {
        setIsEditing(true);
        setFormData({
            ...popup,
            startDate: popup.startDate ? new Date(popup.startDate).toISOString().slice(0, 16) : '',
            endDate: popup.endDate ? new Date(popup.endDate).toISOString().slice(0, 16) : ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await popupService.updatePopup(formData.popupId, formData);
                alert('팝업이 수정되었습니다.');
            } else {
                await popupService.createPopup(formData);
                alert('팝업이 생성되었습니다.');
            }
            setIsModalOpen(false);
            fetchPopups();
        } catch (error) {
            console.error(error);
            alert('저장에 실패했습니다.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        try {
            await popupService.deletePopup(id);
            fetchPopups();
        } catch (error) {
            console.error(error);
            alert('삭제에 실패했습니다.');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">팝업 관리</h1>
                <button
                    onClick={openCreateModal}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                    + 새 팝업 등록
                </button>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">제목</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">타입</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">기간</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">상태</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">로딩중...</td></tr>
                        ) : popups.length === 0 ? (
                            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">등록된 팝업이 없습니다.</td></tr>
                        ) : (
                            popups.map(popup => (
                                <tr key={popup.popupId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{popup.title}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${popup.popupType === 'IMAGE' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                            {popup.description}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(popup.startDate).toLocaleDateString()} ~ {new Date(popup.endDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${popup.isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {popup.isActive ? '사용중' : '중지'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 space-x-2">
                                        <button
                                            onClick={() => openEditModal(popup)}
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                        >
                                            수정
                                        </button>
                                        <button
                                            onClick={() => handleDelete(popup.popupId)}
                                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                                        >
                                            삭제
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-900">
                                {isEditing ? '팝업 수정' : '새 팝업 등록'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">유형</label>
                                    <select
                                        name="popupType"
                                        value={formData.popupType}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="IMAGE">이미지형</option>
                                        <option value="TEXT">텍스트형</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">정렬 순서</label>
                                    <input
                                        type="number"
                                        name="displayOrder"
                                        value={formData.displayOrder}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">시작일시</label>
                                    <input
                                        type="datetime-local"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">종료일시</label>
                                    <input
                                        type="datetime-local"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            {formData.popupType === 'IMAGE' ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">팝업 이미지</label>
                                    <ImageUploader
                                        currentImage={formData.imageUrl}
                                        onUploadSuccess={handleImageUpload}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">팝업 내용</label>
                                    <HtmlEditor
                                        value={formData.content}
                                        onChange={handleEditorChange}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">링크 URL (클릭 시 이동)</label>
                                <input
                                    type="text"
                                    name="linkUrl"
                                    value={formData.linkUrl || ''}
                                    onChange={handleInputChange}
                                    placeholder="https://..."
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    id="isActive"
                                />
                                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">활성 상태 (체크 시 즉시 표시됨)</label>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
                                >
                                    {isEditing ? '수정 완료' : '팝업 생성'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PopupManagePage;
