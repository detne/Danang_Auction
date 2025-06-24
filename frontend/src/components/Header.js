import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import flagLogo from '../assets/logo_co.png';
import '../styles/Header.css';
import { useUser } from '../contexts/UserContext';

const Header = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const { user, setUser } = useUser();
    const navigate = useNavigate();

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

    const formattedTime = currentTime.toLocaleTimeString('vi-VN');
    const formattedDate = currentTime.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    return (
        <header className="header">
            <div className="header-top">
                <div className="logo">
                    <Link to="/" className="logo-link">
                        <img src={logo} alt="DaNangAuction Logo" />
                        <span className="logo-text">DaNangAuction</span>
                    </Link>
                </div>

                <nav className="nav-links">
                    <ul>
                        <li className="dropdown">
                            <a href="#assets">
                                Tài sản đấu giá <span className="dropdown-arrow">▼</span>
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
                            <a href="#auctions">
                                Phiên đấu giá <span className="dropdown-arrow">▼</span>
                            </a>
                            <ul className="dropdown-menu">
                                <li><Link to="/upcoming-auctions">Phiên sắp diễn ra</Link></li>
                                <li><Link to="/ongoing-auctions">Đang diễn ra</Link></li>
                                <li><Link to="/ended-auctions">Đã kết thúc</Link></li>
                            </ul>
                        </li>
                        <li className="dropdown">
                            <a href="#news">
                                Tin tức <span className="dropdown-arrow">▼</span>
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

                <div className="top-right">
                    <div className="language-time">
                        <img src={flagLogo} alt="Vietnam Flag" className="flag-image" />
                        <div className="time-date">
                            <span className="time">{formattedTime}</span>
                            <span className="date">{formattedDate}</span>
                        </div>
                    </div>
                    <div className="search-bar">
                        <button>🔍</button>
                    </div>
                    <div className="auth-buttons">
                        {user ? (
                            <>
                                <span className="welcome-text">👋 Xin chào, {user.firstName || user.username}</span>
                                <button className="logout-btn login-btn" onClick={handleLogout}>Đăng xuất</button>
                            </>
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