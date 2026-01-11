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
        <div className="max-w-4xl mx-auto space-y-8 p-4 md:p-0">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">배너 생성</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl shadow-lg space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2 space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">배너 제목 *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            className="block w-full h-12 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors px-4 text-lg"
                            placeholder="배너 관리용 제목"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">정렬 순서</label>
                        <input
                            type="number"
                            name="displayOrder"
                            value={formData.displayOrder}
                            onChange={handleInputChange}
                            className="block w-full h-12 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors px-4 text-base"
                            min="1"
                        />
                    </div>

                    <div className="flex items-center h-full pt-6">
                        <div className="flex items-center p-4 border border-gray-200 rounded-lg w-full h-12 bg-gray-50">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleInputChange}
                                className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                id="isActive"
                            />
                            <label htmlFor="isActive" className="ml-3 text-sm font-bold text-gray-700 cursor-pointer select-none">
                                활성 상태 (즉시 표시)
                            </label>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">배너 이미지 *</label>
                    <ImageUploader
                        currentImage={formData.imageUrl}
                        onUploadSuccess={handleImageUpload}
                        category="banners"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">링크 URL</label>
                    <input
                        type="text"
                        name="linkUrl"
                        value={formData.linkUrl || ''}
                        onChange={handleInputChange}
                        placeholder="https://example.com (클릭 시 이동할 주소)"
                        className="block w-full h-12 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors px-4 text-base"
                    />
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/banners')}
                        className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all h-12"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-3 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:shadow-lg h-12 min-w-[120px]"
                    >
                        {submitting ? '처리 중...' : '배너 생성'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BannerCreatePage;
