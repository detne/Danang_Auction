import React, { useEffect, useState } from 'react';
import { getPartners } from '../services/api';
import '../styles/PartnersSection.css';

const PartnersSection = () => {
    const [partners, setPartners] = useState([]);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const data = await getPartners();
                const validData = Array.isArray(data) ? data : [];
                setPartners(validData);
            } catch (error) {
                console.error('Lỗi khi tải đối tác:', error);
                setPartners([]);
            }
        };

        fetchPartners();
    }, []);

    return (
        <section className="partners-section">
            <h2>Khách hàng & đối tác tiêu biểu</h2>
            <div className="partners">
                {partners.map((partner, index) => (
                    <div key={index} className="partner">
                        <h3>{partner.name}</h3>
                        <p>{partner.description}</p>
                        <button>Xem chi tiết</button>
                    </div>
                ))}
            </div>
            <div className="view-all-container">
                <a href="#all-partners" className="view-all-btn">Xem tất cả</a>
            </div>
        </section>
    );
};

export default PartnersSection;