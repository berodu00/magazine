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
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">팝업 생성</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">제목 *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">유형</label>
                        <select
                            name="popupType"
                            value={formData.popupType}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="IMAGE">이미지형</option>
                            <option value="TEXT">텍스트형</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">정렬 순서</label>
                        <input
                            type="number"
                            name="displayOrder"
                            value={formData.displayOrder}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">시작일시 *</label>
                        <input
                            type="datetime-local"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">종료일시 *</label>
                        <input
                            type="datetime-local"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                </div>

                {formData.popupType === 'IMAGE' ? (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">팝업 이미지 *</label>
                        <ImageUploader
                            currentImage={formData.imageUrl}
                            onUploadSuccess={handleImageUpload}
                            category="popups"
                        />
                    </div>
                ) : (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">팝업 내용</label>
                        <HtmlEditor
                            value={formData.content}
                            onChange={handleEditorChange}
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">링크 URL (클릭 시 이동)</label>
                    <input
                        type="text"
                        name="linkUrl"
                        value={formData.linkUrl || ''}
                        onChange={handleInputChange}
                        placeholder="https://..."
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
                        onClick={() => navigate('/admin/popups')}
                        className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50"
                    >
                        {submitting ? '생성 중...' : '팝업 생성'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PopupCreatePage;
