// src/pages/NotFoundPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NotFound.css';

const NotFoundPage = () => {
    return (
        <div className="not-found-page">
            <div className="not-found-container">
                <div className="not-found-content">
                    <div className="error-code">404</div>
                    <h1>Trang không tìm thấy</h1>
                    <p>Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>

                    <div className="not-found-actions">
                        <Link to="/" className="btn btn-primary">
                            Về trang chủ
                        </Link>
                        <Link to="/upcoming-auctions" className="btn btn-secondary">
                            Xem đấu giá
                        </Link>
                    </div>

                    <div className="suggestions">
                        <h3>Có thể bạn đang tìm:</h3>
                        <ul>
                            <li><Link to="/upcoming-auctions">Phiên đấu giá sắp diễn ra</Link></li>
                            <li><Link to="/ongoing-auctions">Phiên đấu giá đang diễn ra</Link></li>
                            <li><Link to="/ended-auctions">Phiên đấu giá đã kết thúc</Link></li>
                            <li><Link to="/announcements">Thông báo</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;