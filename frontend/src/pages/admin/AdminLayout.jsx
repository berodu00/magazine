import React, { useContext } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const AdminLayout = () => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) return <div>Loading...</div>;

    if (!user || user.role !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    const menuItems = [
        { path: '/admin/dashboard', label: '대시보드' },
        { path: '/admin/articles', label: '게시물 관리' },
        { path: '/admin/categories', label: '카테고리 관리' },
        { path: '/admin/events', label: '이벤트 관리' },
        { path: '/admin/ideas', label: '제안 관리' },
        { path: '/admin/popups', label: '팝업 관리' },
        { path: '/admin/banners', label: '배너 관리' },
        { path: '/admin/newsletters', label: '뉴스레터 발송' },
        { path: '/admin/resources', label: '리소스 관리' },
    ];

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
            {/* Sidebar / Top Menu */}
            {/* Sidebar / Top Menu */}
            <div className="w-full lg:w-72 bg-slate-900 text-white flex-shrink-0 shadow-xl z-20 flex flex-col">
                <div className="p-4 lg:p-6 text-xl font-bold border-b border-slate-800 flex justify-between items-center bg-slate-900 sticky top-0 z-30">
                    <div className="flex items-center space-x-2">
                        <span className="text-blue-500">⚡</span>
                        <span>관리자 메뉴</span>
                    </div>
                </div>
                <nav className="flex-1 overflow-x-auto lg:overflow-x-hidden lg:overflow-y-auto flex flex-row lg:flex-col p-2 lg:p-0 lg:mt-4 space-x-2 lg:space-x-0 space-y-0 text-sm lg:text-base whitespace-nowrap scrollbar-hide">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`block px-4 py-2 lg:py-3 rounded-lg lg:rounded-none hover:bg-slate-700 transition-colors flex-shrink-0 ${location.pathname.startsWith(item.path)
                                ? 'bg-slate-700 text-white lg:border-l-4 lg:border-blue-500'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <Link to="/" className="block px-4 py-2 lg:py-3 lg:mt-8 hover:bg-slate-700 text-gray-400 flex-shrink-0 border-l border-slate-700 lg:border-l-0 lg:border-t">
                        ← 메인
                    </Link>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-x-hidden overflow-y-auto">
                <header className="bg-white shadow p-4 flex justify-between items-center">
                    <div className="font-semibold text-gray-700">
                        {menuItems.find(item => location.pathname.startsWith(item.path))?.label || '대시보드'}
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">관리자님 환영합니다</span>
                    </div>
                </header>
                <main className="p-4 lg:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
