import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bannerService } from '../../services/bannerService';
import ImageUploader from '../../components/common/ImageUploader';

const BannerCreatePage = () => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        imageUrl: '',
        linkUrl: '',
        displayOrder: 1,
        isActive: true
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageUpload = (fileData) => {
        setFormData(prev => ({ ...prev, imageUrl: fileData.url }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await bannerService.createBanner(formData);
            alert('배너가 생성되었습니다.');
            navigate('/admin/banners');
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
                <h1 className="text-2xl font-bold text-gray-800">배너 생성</h1>
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">정렬 순서</label>
                        <input
                            type="number"
                            name="displayOrder"
                            value={formData.displayOrder}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            min="1"
                        />
                    </div>

                    <div className="flex items-center pt-7">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleInputChange}
                            className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            id="isActive"
                        />
                        <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">활성 상태</label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">배너 이미지 *</label>
                    <ImageUploader
                        currentImage={formData.imageUrl}
                        onUploadSuccess={handleImageUpload}
                        category="banners"
                    />
                </div>

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

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/banners')}
                        className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50"
                    >
                        {submitting ? '생성 중...' : '배너 생성'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BannerCreatePage;
