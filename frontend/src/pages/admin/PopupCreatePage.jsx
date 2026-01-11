import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { popupService } from '../../services/popupService';
import ImageUploader from '../../components/common/ImageUploader';
import HtmlEditor from '../../components/editor/HtmlEditor';

const PopupCreatePage = () => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
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
        setFormData(prev => ({ ...prev, imageUrl: fileData.url }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await popupService.createPopup(formData);
            alert('팝업이 생성되었습니다.');
            navigate('/admin/popups');
        } catch (error) {
            console.error(error);
            alert('저장에 실패했습니다.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-4 md:p-0">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">팝업 생성</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl shadow-lg space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2 space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">팝업 제목 *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            className="block w-full h-12 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors px-4 text-lg"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">유형</label>
                        <select
                            name="popupType"
                            value={formData.popupType}
                            onChange={handleInputChange}
                            className="block w-full h-12 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors px-4 bg-white"
                        >
                            <option value="IMAGE">이미지형</option>
                            <option value="TEXT">텍스트형</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">정렬 순서</label>
                        <input
                            type="number"
                            name="displayOrder"
                            value={formData.displayOrder}
                            onChange={handleInputChange}
                            className="block w-full h-12 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors px-4 text-base"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">시작일시 *</label>
                        <input
                            type="datetime-local"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleInputChange}
                            required
                            className="block w-full h-12 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors px-4 text-base"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">종료일시 *</label>
                        <input
                            type="datetime-local"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleInputChange}
                            required
                            className="block w-full h-12 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors px-4 text-base"
                        />
                    </div>
                </div>

                {formData.popupType === 'IMAGE' ? (
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">팝업 이미지 *</label>
                        <ImageUploader
                            currentImage={formData.imageUrl}
                            onUploadSuccess={handleImageUpload}
                            category="popups"
                        />
                    </div>
                ) : (
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">팝업 내용</label>
                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                            <HtmlEditor
                                value={formData.content}
                                onChange={handleEditorChange}
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">링크 URL (클릭 시 이동)</label>
                    <input
                        type="text"
                        name="linkUrl"
                        value={formData.linkUrl || ''}
                        onChange={handleInputChange}
                        placeholder="https://..."
                        className="block w-full h-12 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors px-4 text-base"
                    />
                </div>

                <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                        id="isActive"
                    />
                    <label htmlFor="isActive" className="ml-3 text-sm font-bold text-gray-700 cursor-pointer select-none">
                        활성 상태 (체크 시 즉시 표시됨)
                    </label>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/popups')}
                        className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all h-12"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-3 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:shadow-lg h-12 min-w-[120px]"
                    >
                        {submitting ? '처리 중...' : '팝업 생성'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PopupCreatePage;
