import React, { useContext, useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const AdminLayout = () => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

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

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white 
                    transform transition-transform duration-300 ease-in-out 
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                    lg:translate-x-0 flex-shrink-0 flex flex-col shadow-xl
                `}
            >
                <div className="p-6 text-xl font-bold border-b border-slate-800 flex justify-between items-center bg-slate-900">
                    <div className="flex items-center space-x-2">
                        <span className="text-blue-500">⚡</span>
                        <span>관리자 메뉴</span>
                    </div>
                    {/* Close button for mobile */}
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
                        ✕
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)} // Close sidebar on click (mobile)
                            className={`block px-6 py-3 transition-colors ${location.pathname.startsWith(item.path)
                                ? 'bg-slate-700 text-white border-l-4 border-blue-500'
                                : 'text-gray-400 hover:text-white hover:bg-slate-800'
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}

                    <div className="pt-8 mt-8 border-t border-slate-800">
                        <Link
                            to="/"
                            className="block px-6 py-3 text-gray-400 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                            ← 메인으로 돌아가기
                        </Link>
                    </div>
                </nav>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow p-4 lg:px-8 flex justify-between items-center z-10">
                    <div className="flex items-center gap-4">
                        {/* Hamburger Button */}
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden p-2 -ml-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <h2 className="text-xl font-bold text-gray-800 truncate">
                            {menuItems.find(item => location.pathname.startsWith(item.path))?.label || '대시보드'}
                        </h2>
                    </div>

                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-600 hidden md:inline">관리자님 환영합니다</span>
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            A
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-6 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
