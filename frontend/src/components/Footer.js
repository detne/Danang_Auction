import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFooterInfo } from '../services/api';
import '../styles/Footer.css';

const Footer = () => {
    const [footerData, setFooterData] = useState({
        about: 'Đấu giá trực tuyến uy tín hàng đầu tại Đà Nẵng.',
        links: [
            { label: 'Trang chủ', url: '/' },
            { label: 'Đấu giá', url: '/auctions' },
            { label: 'Tin tức', url: '/news' },
            { label: 'Liên hệ', url: '/contact' },
        ],
        contact: {
            email: 'support@danangauction.vn',
            phone: '0123 456 789',
            address: '123 Đường Lê Lợi, Đà Nẵng',
        },
        social: [
            { label: 'Facebook', url: '#facebook' },
            { label: 'Twitter', url: '#twitter' },
            { label: 'Instagram', url: '#instagram' },
        ],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await getFooterInfo();
                const data = response?.data || response || {};

                setFooterData({
                    about: data.about || 'Đấu giá trực tuyến uy tín hàng đầu tại Đà Nẵng.',
                    links: Array.isArray(data.links) ? data.links.map(link => ({
                        label: link.label || 'Liên kết',
                        url: link.url || '#',
                    })) : [],
                    contact: {
                        email: data.contact?.email || 'support@danangauction.vn',
                        phone: data.contact?.phone || '0123 456 789',
                        address: data.contact?.address || '123 Đường Lê Lợi, Đà Nẵng',
                    },
                    social: Array.isArray(data.social) ? data.social.map(social => ({
                        label: social.label || 'Mạng xã hội',
                        url: social.url || '#',
                    })) : [],
                });
            } catch (error) {
                console.error('Lỗi khi tải footer:', error);
                setError('Không thể tải dữ liệu từ server. Sử dụng dữ liệu mặc định.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>DaNangAuction</h3>
                    <p>{footerData.about}</p>
                </div>
                <div className="footer-section">
                    <h3>Liên kết nhanh</h3>
                    <ul>
                        {footerData.links.map((link, index) => (
                            <li key={index}><Link to={link.url}>{link.label}</Link></li>
                        ))}
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Liên hệ</h3>
                    <p>Email: {footerData.contact.email}</p>
                    <p>Điện thoại: {footerData.contact.phone}</p>
                    <p>Địa chỉ: {footerData.contact.address}</p>
                </div>
                <div className="footer-section">
                    <h3>Theo dõi chúng tôi</h3>
                    <div className="social-links">
                        {footerData.social.map((item, index) => (
                            <a key={index} href={item.url}>{item.label}</a>
                        ))}
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