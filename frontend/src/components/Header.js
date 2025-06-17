import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import flagLogo from '../assets/logo_co.png';
import '../styles/Header.css';

const Header = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

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
                                <li><a href="#upcoming-auctions">Phiên đấu giá sắp đấu giá</a></li>
                                <li><a href="#ongoing-auctions">Phiên đấu giá đang diễn ra</a></li>
                                <li><a href="#ended-auctions">Phiên đấu giá đã kết thúc</a></li>
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
                        <Link to="/login" className="login-btn">Đăng nhập</Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;