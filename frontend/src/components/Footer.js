import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>DaNangAuction</h3>
                    <p>Đấu giá trực tuyến uy tín hàng đầu tại Đà Nẵng.</p>
                </div>
                <div className="footer-section">
                    <h3>Liên kết nhanh</h3>
                    <ul>
                        <li><a href="#home">Trang chủ</a></li>
                        <li><a href="#auctions">Đấu giá</a></li>
                        <li><a href="#news">Tin tức</a></li>
                        <li><a href="#contact">Liên hệ</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Liên hệ</h3>
                    <p>Email: support@danangauction.vn</p>
                    <p>Điện thoại: 0123 456 789</p>
                    <p>Địa chỉ: 123 Đường Lê Lợi, Đà Nẵng</p>
                </div>
                <div className="footer-section">
                    <h3>Theo dõi chúng tôi</h3>
                    <div className="social-links">
                        <a href="#facebook">Facebook</a>
                        <a href="#twitter">Twitter</a>
                        <a href="#instagram">Instagram</a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2025 DaNangAuction. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;