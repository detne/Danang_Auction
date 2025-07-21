import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import flagLogo from '../assets/logo_co.png';
import { useUser } from '../contexts/UserContext';
import '../styles/Header.css';

const Header = () => {
    const { user, setUser, loading } = useUser();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Thêm trạng thái cho menu mobile
    const dropdownRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
        setIsDropdownOpen(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery(''); // Reset ô tìm kiếm sau khi submit
        }
    };

    const formattedTime = currentTime.toLocaleTimeString('vi-VN', { hour12: false });
    const formattedDate = currentTime.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const getAvatarText = () => {
        if (user?.username) {
            return user.username.charAt(0).toUpperCase();
        }
        return 'U';
    };

    const toggleDropdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDropdownOpen((prev) => !prev);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev);
    };

    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleMenuItemClick = () => {
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false); // Đóng menu mobile khi chọn mục
    };

    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }

    return (
        <header className="header">
            <div className="header-top">
                <div className="logo">
                    <Link to="/" className="logo-link" onClick={handleMenuItemClick}>
                        <img src={logo} alt="DaNangAuction Logo" />
                        <span className="logo-text">DaNangAuction</span>
                    </Link>
                </div>

                {/* Nút toggle menu mobile */}
                <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Toggle menu">
                    <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                </button>

                <nav className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
                    <ul>
                        <li className="dropdown">
                            <button className="dropdown-toggle" aria-expanded={isDropdownOpen}>
                                Tài sản đấu giá
                            </button>
                            <ul className="dropdown-menu">
                                <li><Link to="#state-assets" onClick={handleMenuItemClick}>Tài sản nhà nước</Link></li>
                                <li><Link to="#real-estate" onClick={handleMenuItemClick}>Bất động sản</Link></li>
                                <li><Link to="#vehicles" onClick={handleMenuItemClick}>Phương tiện - xe cộ</Link></li>
                                <li><Link to="#art" onClick={handleMenuItemClick}>Sưu tầm - nghệ thuật</Link></li>
                                <li><Link to="#luxury" onClick={handleMenuItemClick}>Hàng hiệu xa xỉ</Link></li>
                                <li><Link to="#other-assets" onClick={handleMenuItemClick}>Tài sản khác</Link></li>
                            </ul>
                        </li>
                        <li className="dropdown">
                            <button className="dropdown-toggle" aria-expanded={isDropdownOpen}>
                                Phiên đấu giá
                            </button>
                            <ul className="dropdown-menu">
                                <li><Link to="/upcoming-auctions" onClick={handleMenuItemClick}>Phiên sắp diễn ra</Link></li>
                                <li><Link to="/ongoing-auctions" onClick={handleMenuItemClick}>Đang diễn ra</Link></li>
                                <li><Link to="/ended-auctions" onClick={handleMenuItemClick}>Đã kết thúc</Link></li>
                            </ul>
                        </li>
                        <li className="dropdown">
                            <button className="dropdown-toggle" aria-expanded={isDropdownOpen}>
                                Tin tức
                            </button>
                            <ul className="dropdown-menu">
                                <li><Link to="/announcements" onClick={handleMenuItemClick}>Thông báo</Link></li>
                                <li><Link to="/auction-notices" onClick={handleMenuItemClick}>Thông báo đấu giá</Link></li>
                                <li><Link to="/other-news" onClick={handleMenuItemClick}>Tin khác</Link></li>
                            </ul>
                        </li>
                        <li><Link to="#about" onClick={handleMenuItemClick}>Giới thiệu</Link></li>
                        <li><Link to="#contact" onClick={handleMenuItemClick}>Liên hệ</Link></li>
                    </ul>
                </nav>

                <div className="top-right">
                    <div className="language-time">
                        <img src={flagLogo} alt="Cờ Việt Nam" className="flag-image" />
                        <div className="time-date">
                            <span className="time">{formattedTime}</span>
                            <span className="date">{formattedDate}</span>
                        </div>
                    </div>

                    <form className="search-bar" onSubmit={handleSearch}>
                        <input
                            type="search"
                            placeholder="Tìm kiếm..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="form-control"
                            aria-label="Tìm kiếm"
                        />

                    </form>

                    <div className="auth-buttons">
                        {user ? (
                            <div className="user-avatar-dropdown" ref={dropdownRef}>
                                <button
                                    className="user-avatar"
                                    onClick={toggleDropdown}
                                    aria-label="Menu người dùng"
                                    aria-expanded={isDropdownOpen}
                                >
                                    {user.avatar ? (
                                        <img src={user.avatar} alt="Avatar người dùng" className="avatar-image" />
                                    ) : (
                                        <div className="avatar-placeholder">{getAvatarText()}</div>
                                    )}
                                </button>
                                {isDropdownOpen && (
                                    <div className="user-dropdown-menu">
                                        <div className="dropdown-user-info">
                                            <div className="user-avatar-small">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt="Avatar người dùng" className="avatar-image-small" />
                                                ) : (
                                                    <div className="avatar-placeholder-small">{getAvatarText()}</div>
                                                )}
                                            </div>
                                            <div className="user-details">
                                                <div className="user-name">{user.username || 'Người dùng'}</div>
                                                <div className="user-email">{user.email || 'user@example.com'}</div>
                                            </div>
                                        </div>
                                        <Link to="/profile" className="dropdown-item-custom" onClick={handleMenuItemClick}>
                                            <i className="fas fa-user"></i> Thông tin cá nhân
                                        </Link>
                                        <Link to="/my-auctions" className="dropdown-item-custom" onClick={handleMenuItemClick}>
                                            <i className="fas fa-gavel"></i> Phiên đấu giá của tôi
                                        </Link>
                                        <Link to="/settings" className="dropdown-item-custom" onClick={handleMenuItemClick}>
                                            <i className="fas fa-cog"></i> Cài đặt
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                handleMenuItemClick();
                                            }}
                                            className="dropdown-item-custom logout-item"
                                        >
                                            <i className="fas fa-sign-out-alt"></i> Đăng xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="login-btn" onClick={handleMenuItemClick}>
                                Đăng nhập
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;