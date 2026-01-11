import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
            <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-primary hover:text-primary-dark transition-colors z-50 relative" onClick={closeMenu}>
                    KZ Magazine
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link to="/" className="text-secondary-dark hover:text-primary font-medium transition-colors">홈</Link>
                    <Link to="/articles" className="text-secondary-dark hover:text-primary font-medium transition-colors">웹진</Link>
                    <Link to="/social" className="text-secondary-dark hover:text-primary font-medium transition-colors">소셜</Link>
                    <Link to="/events" className="text-secondary-dark hover:text-primary font-medium transition-colors">이벤트</Link>
                </nav>

                {/* Desktop User Menu */}
                <div className="hidden md:flex items-center gap-4">
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

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden z-50 p-2 text-gray-600 hover:text-primary transition-colors"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>

                {/* Mobile Navigation Drawer */}
                <div
                    className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col pt-24 px-6 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    <nav className="flex flex-col gap-6 text-lg">
                        <Link to="/" onClick={closeMenu} className="font-medium text-gray-900 hover:text-primary border-b border-gray-100 pb-4">홈</Link>
                        <Link to="/articles" onClick={closeMenu} className="font-medium text-gray-900 hover:text-primary border-b border-gray-100 pb-4">웹진</Link>
                        <Link to="/social" onClick={closeMenu} className="font-medium text-gray-900 hover:text-primary border-b border-gray-100 pb-4">소셜</Link>
                        <Link to="/events" onClick={closeMenu} className="font-medium text-gray-900 hover:text-primary border-b border-gray-100 pb-4">이벤트</Link>
                    </nav>

                    <div className="mt-8 flex flex-col gap-4">
                        {user ? (
                            <>
                                <div className="flex items-center justify-between text-gray-600 mb-4">
                                    <span>안녕하세요, <strong>{user.name}</strong>님</span>
                                </div>
                                <Link
                                    to="/my-ideas"
                                    onClick={closeMenu}
                                    className="w-full py-3 text-center border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    내 제안
                                </Link>
                                {user.role === 'ADMIN' && (
                                    <Link
                                        to="/admin"
                                        onClick={closeMenu}
                                        className="w-full py-3 text-center border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        관리자 페이지
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                >
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                onClick={closeMenu}
                                className="w-full py-3 bg-primary text-white rounded-lg text-center font-medium hover:bg-primary-dark transition-colors shadow-sm"
                            >
                                로그인
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
