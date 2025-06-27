import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import flagLogo from '../assets/logo_co.png';
import { useUser } from '../contexts/UserContext';
import '../styles/Header.css';

const Header = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const { user, setUser, loading } = useUser();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const formattedTime = currentTime.toLocaleTimeString('vi-VN', { hour12: false });
    const formattedDate = currentTime.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    // Tạo avatar từ chữ cái đầu của tên người dùng
    const getAvatarText = () => {
        if (user?.username) {
            return user.username.charAt(0).toUpperCase();
        }
        return 'U';
    };

    if (loading) {
        return <div>Đang tải...</div>;
    }

    return (
        <header className="header">
            <div className="header-top">
                {/* Logo */}
                <div className="logo">
                    <Link to="/" className="logo-link">
                        <img src={logo} alt="DaNangAuction Logo" />
                        <span className="logo-text">DaNangAuction</span>
                    </Link>
                </div>

                {/* Navigation Menu */}
                <nav className="nav-links">
                    <ul>
                        <li className="dropdown">
                            <a href="#" className="dropdown-toggle">
                                Tài sản đấu giá
                            </a>
                            <ul className="dropdown-menu">
                                <li><a href="#state-assets">Tài sản nhà nước</a></li>
                                <li><a href="#real-estate">Bất động sản</a></li>
                                <li><a href="#vehicles">Phương tiện - xe cộ</a></li>
                                <li><a href="#art">Sưu tầm - nghệ thuật</a></li>
                                <li><a href="#luxury">Hàng hiệu xa xỉ</a></li>
                                <li><a href="#other-assets">Tài sản khác</a></li>
                            </ul>
                        </li>
                        <li className="dropdown">
                            <a href="#" className="dropdown-toggle">
                                Phiên đấu giá
                            </a>
                            <ul className="dropdown-menu">
                                <li><Link to="/upcoming-auctions">Phiên sắp diễn ra</Link></li>
                                <li><Link to="/ongoing-auctions">Đang diễn ra</Link></li>
                                <li><Link to="/ended-auctions">Đã kết thúc</Link></li>
                            </ul>
                        </li>
                        <li className="dropdown">
                            <a href="#" className="dropdown-toggle">
                                Tin tức
                            </a>
                            <ul className="dropdown-menu">
                                <li><a href="#announcements">Thông báo</a></li>
                                <li><a href="#auction-notices">Thông báo đấu giá</a></li>
                                <li><a href="#other-news">Tin khác</a></li>
                            </ul>
                        </li>
                        <li><a href="#about">Giới thiệu</a></li>
                        <li><a href="#contact">Liên hệ</a></li>
                    </ul>
                </nav>

                {/* Right Side */}
                <div className="top-right">
                    {/* Time and Flag */}
                    <div className="language-time">
                        <img src={flagLogo} alt="VN flag" className="flag-image" />
                        <div className="time-date">
                            <span className="time">{formattedTime}</span>
                            <span className="date">{formattedDate}</span>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <form className="search-bar" onSubmit={handleSearch}>
                        <input
                            type="search"
                            placeholder="Tìm kiếm..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="form-control"
                        />
                    </form>

                    {/* Auth Buttons */}
                    <div className="auth-buttons">
                        {user ? (
                            <div className="user-avatar-dropdown">
                                <div className="user-avatar">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt="Avatar" className="avatar-image" />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            {getAvatarText()}
                                        </div>
                                    )}
                                </div>
                                <div className="user-dropdown-menu">
                                    <div className="dropdown-user-info">
                                        <div className="user-avatar-small">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt="Avatar" className="avatar-image-small" />
                                            ) : (
                                                <div className="avatar-placeholder-small">
                                                    {getAvatarText()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="user-details">
                                            <div className="user-name">{user.username || 'Người dùng'}</div>
                                            <div className="user-email">{user.email || 'user@example.com'}</div>
                                        </div>
                                    </div>
                                    <Link to="/profile" className="dropdown-item-custom">
                                        <i className="fas fa-user"></i>
                                        Thông tin cá nhân
                                    </Link>
                                    <Link to="/my-auctions" className="dropdown-item-custom">
                                        <i className="fas fa-gavel"></i>
                                        Phiên đấu giá của tôi
                                    </Link>
                                    <Link to="/settings" className="dropdown-item-custom">
                                        <i className="fas fa-cog"></i>
                                        Cài đặt
                                    </Link>
                                    <button onClick={handleLogout} className="dropdown-item-custom logout-item">
                                        <i className="fas fa-sign-out-alt"></i>
                                        Đăng xuất
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="login-btn">
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