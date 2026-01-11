import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
            <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-primary hover:text-primary-dark transition-colors">
                    KZ Magazine
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link to="/" className="text-secondary-dark hover:text-primary font-medium transition-colors">홈</Link>
                    <Link to="/articles" className="text-secondary-dark hover:text-primary font-medium transition-colors">웹진</Link>
                    <Link to="/social" className="text-secondary-dark hover:text-primary font-medium transition-colors">소셜</Link>
                    <Link to="/events" className="text-secondary-dark hover:text-primary font-medium transition-colors">이벤트</Link>
                </nav>

                {/* User Menu */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            {user.role === 'ADMIN' && (
                                <Link to="/admin" className="text-sm font-medium text-secondary-dark hover:text-gray-900">
                                    관리자
                                </Link>
                            )}
                            <Link to="/my-ideas" className="text-sm font-medium text-secondary-dark hover:text-primary transition-colors">
                                내 제안
                            </Link>
                            <span className="text-sm text-secondary-dark">{user.name}님</span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm font-medium text-secondary-dark hover:text-gray-900 transition-colors"
                            >
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors shadow-sm"
                        >
                            로그인
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
