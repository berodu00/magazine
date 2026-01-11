import React, { useState, useEffect } from 'react';
import { articleService } from '../../services/articleService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CategoryManagePage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [displayOrder, setDisplayOrder] = useState(0);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await articleService.getCategories();
            setCategories(data);
            // Auto-increment display order for next category
            if (data.length > 0) {
                const maxOrder = Math.max(...data.map(c => c.displayOrder || 0));
                setDisplayOrder(maxOrder + 1);
            }
        } catch (error) {
            console.error('Failed to fetch categories', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        try {
            await articleService.createCategory({
                name: newCategoryName,
                displayOrder: parseInt(displayOrder)
            });
            setNewCategoryName('');
            setDisplayOrder(prev => prev + 1);
            fetchCategories(); // Refresh list
            alert('카테고리가 추가되었습니다.');
        } catch (error) {
            console.error('Failed to create category', error);
            alert('카테고리 추가 실패: ' + (error.response?.data?.message || '알 수 없는 오류'));
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">로딩 중...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            <h1 className="text-3xl font-bold text-gray-900 border-b pb-4">카테고리 관리</h1>

            {/* Add Category Form */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">새 카테고리 추가</h2>
                <form onSubmit={handleSubmit} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">카테고리명</label>
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="예: News"
                            required
                        />
                    </div>
                    <div className="w-24">
                        <label className="block text-sm font-medium text-gray-700 mb-1">순서</label>
                        <input
                            type="number"
                            value={displayOrder}
                            onChange={(e) => setDisplayOrder(e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        추가
                    </button>
                </form>
            </div>

            {/* Category List */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">순서</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categories.map((category) => (
                            <tr key={category.categoryId} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {category.categoryId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {category.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {category.displayOrder}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {category.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                                    등록된 카테고리가 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CategoryManagePage;
