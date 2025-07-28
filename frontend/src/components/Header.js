import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import flagLogo from '../assets/logo_co.png';
import { useUser } from '../contexts/UserContext';
import useCurrentTime from '../hooks/common/useCurrentTime';
import UserAvatarDropdown from './common/UserAvatarDropdown';
import { useBalance } from '../hooks/user/useBalance';
import '../styles/Header.css';

const Header = () => {
    const { user, setUser, loading } = useUser();
    const balance = useBalance();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const currentTime = useCurrentTime();

    const formattedTime = currentTime.toLocaleTimeString('vi-VN', { hour12: false });
    const formattedDate = currentTime.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

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
        }
    };

    if (loading) return <div>Đang tải...</div>;

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

                {/* Navigation */}
                <nav className="nav-links">
                    <ul>
                        <li className="dropdown">
                            <button className="dropdown-toggle">Tài sản đấu giá</button>
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
                            <button className="dropdown-toggle">Phiên đấu giá</button>
                            <ul className="dropdown-menu">
                                <li><Link to="/upcoming-auctions">Phiên sắp diễn ra</Link></li>
                                <li><Link to="/ongoing-auctions">Đang diễn ra</Link></li>
                                <li><Link to="/ended-auctions">Đã kết thúc</Link></li>
                            </ul>
                        </li>
                        <li className="dropdown">
                            <button className="dropdown-toggle">Tin tức</button>
                            <ul className="dropdown-menu">
                                <li><Link to="/announcements">Thông báo</Link></li>
                                <li><Link to="/auction-notices">Thông báo đấu giá</Link></li>
                                <li><Link to="/other-news">Tin khác</Link></li>
                            </ul>
                        </li>
                        <li><Link to="/introduction">Giới thiệu</Link></li>
                        <li><Link to="/contact">Liên hệ</Link></li>
                    </ul>
                </nav>

                {/* Top Right: Time + Search + Auth */}
                <div className="top-right">
                    {/* Time + Date */}
                    <div className="language-time">
                        <img src={flagLogo} alt="VN flag" className="flag-image" />
                        <div className="time-date">
                            <span className="time">{formattedTime}</span>
                            <span className="date">{formattedDate}</span>
                        </div>
                    </div>

                    {/* Search */}
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
                    {/* Auth Buttons */}
                    <div className="auth-buttons d-flex align-items-center gap-3">
                        {user && (
                            <span className="balance-display text-success fw-bold">
                                💰 {balance.toLocaleString('vi-VN')} VND
                            </span>
                        )}
                        {user ? (
                            <UserAvatarDropdown
                                user={user}
                                onLogout={handleLogout}
                                isDropdownOpen={isDropdownOpen}
                                setIsDropdownOpen={setIsDropdownOpen}
                            />
                        ) : (
                            <Link to="/login" className="login-btn">Đăng nhập</Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
