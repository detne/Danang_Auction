import React from 'react';
import { Link } from 'react-router-dom';
import useFooterInfo from '../hooks/common/useFooterInfo';
import '../styles/Footer.css';

const defaultFooter = {
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
};

const Footer = () => {
    const { footerData, loading, error } = useFooterInfo();

    const data = {
        about: footerData?.about || defaultFooter.about,
        links: Array.isArray(footerData?.links) ? footerData.links : defaultFooter.links,
        contact: {
            email: footerData?.contact?.email || defaultFooter.contact.email,
            phone: footerData?.contact?.phone || defaultFooter.contact.phone,
            address: footerData?.contact?.address || defaultFooter.contact.address,
        },
        social: Array.isArray(footerData?.social) ? footerData.social : defaultFooter.social,
    };

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>DaNangAuction</h3>
                    <p>{data.about}</p>
                </div>
                <div className="footer-section">
                    <h3>Liên kết nhanh</h3>
                    <ul>
                        {data.links.map((link, index) => (
                            <li key={index}><Link to={link.url}>{link.label}</Link></li>
                        ))}
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Liên hệ</h3>
                    <p>Email: {data.contact.email}</p>
                    <p>Điện thoại: {data.contact.phone}</p>
                    <p>Địa chỉ: {data.contact.address}</p>
                </div>
                <div className="footer-section">
                    <h3>Theo dõi chúng tôi</h3>
                    <div className="social-links">
                        {data.social.map((item, index) => (
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
