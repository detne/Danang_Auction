import React, { useEffect, useState } from 'react';
import '../styles/Footer.css';
import { getFooterInfo } from '../services/api';

const Footer = () => {
    const [footerData, setFooterData] = useState({
        about: '',
        links: [],
        contact: { email: '', phone: '', address: '' },
        social: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getFooterInfo();
                const data = response?.data || response || {};

                setFooterData({
                    about: data.about || '',
                    links: Array.isArray(data.links) ? data.links : [],
                    contact: {
                        email: data.contact?.email || '',
                        phone: data.contact?.phone || '',
                        address: data.contact?.address || ''
                    },
                    social: Array.isArray(data.social) ? data.social : []
                });
            } catch (error) {
                console.error('Lỗi khi tải footer:', error);
            }
        };
        fetchData();
    }, []);

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
                        {(footerData.links || []).map((link, index) => (
                            <li key={index}><a href={link.url}>{link.label}</a></li>
                        ))}
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Liên hệ</h3>
                    <p>Email: {footerData.contact?.email || ''}</p>
                    <p>Điện thoại: {footerData.contact?.phone || ''}</p>
                    <p>Địa chỉ: {footerData.contact?.address || ''}</p>
                </div>

                <div className="footer-section">
                    <h3>Theo dõi chúng tôi</h3>
                    <div className="social-links">
                        {(footerData.social || []).map((item, index) => (
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