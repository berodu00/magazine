import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bannerService } from '../../services/bannerService';
import ImageUploader from '../../components/common/ImageUploader';

const BannerManagePage = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, bannerId: null });

    const [formData, setFormData] = useState({
        title: '',
        imageUrl: '',
        linkUrl: '',
        displayOrder: 0,
        isActive: true
    });

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const response = await bannerService.getAllBanners(0, 50); // Fetch enough for sorting
            setBanners(response.content);
        } catch (error) {
            console.error(error);
            alert('배너 목록을 불러오지 못했습니다.');
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

    const handleImageUpload = (fileData) => {
        // Backend returns { url: "/uploads/..." }
        setFormData(prev => ({ ...prev, imageUrl: fileData.url }));
    };

    const openCreateModal = () => {
        setIsEditing(false);
        setFormData({
            title: '',
            imageUrl: '',
            linkUrl: '',
            displayOrder: banners.length + 1,
            isActive: true
        });
        setIsModalOpen(true);
    };

    const openEditModal = (banner) => {
        setIsEditing(true);
        setFormData(banner);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await bannerService.updateBanner(formData.bannerId, formData);
                alert('배너가 수정되었습니다.');
            } else {
                await bannerService.createBanner(formData);
                alert('배너가 생성되었습니다.');
            }
            setIsModalOpen(false);
            fetchBanners();
        } catch (error) {
            console.error(error);
            alert('저장에 실패했습니다.');
        }
    };

    const confirmDelete = (bannerId) => {
        setDeleteConfirm({ show: true, bannerId });
    };

    const handleDelete = async () => {
        try {
            await bannerService.deleteBanner(deleteConfirm.bannerId);
            setDeleteConfirm({ show: false, bannerId: null });
            fetchBanners();
        } catch (error) {
            console.error(error);
            alert('삭제에 실패했습니다.');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">배너 관리</h1>
                <Link
                    to="/admin/banners/create"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                    + 새 배너 등록
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">순서</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">이미지</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">제목 / 링크</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">상태</th>
                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">로딩중...</td></tr>
                        ) : banners.length === 0 ? (
                            <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">등록된 배너가 없습니다.</td></tr>
                        ) : (
                            banners.map(banner => (
                                <tr key={banner.bannerId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{banner.displayOrder}</td>
                                    <td className="px-6 py-4">
                                        <div className="w-24 h-12 bg-gray-100 rounded overflow-hidden">
                                            <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{banner.title}</div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs">{banner.linkUrl}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${banner.isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {banner.isActive ? '사용중' : '중지'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 space-x-2">
                                        <button
                                            onClick={() => openEditModal(banner)}
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                        >
                                            수정
                                        </button>
                                        <button
                                            onClick={() => confirmDelete(banner.bannerId)}
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

            {/* Edit/Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-900">
                                {isEditing ? '배너 수정' : '새 배너 등록'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">배너 제목 *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="block w-full h-12 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors px-4 text-base"
                                    placeholder="배너 관리용 제목"
                                />
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
                                    className="block w-full h-12 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors px-4 text-base"
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
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
                                <div className="flex items-center pt-6">
                                    <div className="flex items-center p-3 border border-gray-200 rounded-lg w-full h-12 bg-gray-50">
                                        <input
                                            type="checkbox"
                                            name="isActive"
                                            checked={formData.isActive}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                            id="isActiveModal"
                                        />
                                        <label htmlFor="isActiveModal" className="ml-3 text-sm font-bold text-gray-700 cursor-pointer select-none">
                                            활성 상태
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors h-11"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 h-11"
                                >
                                    {isEditing ? '수정 완료' : '배너 생성'}
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
                                    <h3 className="text-lg font-bold text-gray-900">배너 삭제</h3>
                                    <p className="text-sm text-gray-600 mt-1">정말 삭제하시겠습니까?</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mb-6">
                                이 작업은 되돌릴 수 없습니다.
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setDeleteConfirm({ show: false, bannerId: null })}
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

export default BannerManagePage;
