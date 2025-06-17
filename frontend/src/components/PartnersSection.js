import React from 'react';
import '../styles/PartnersSection.css';

const PartnersSection = () => {
    const partners = [
        { name: 'Công ty A', description: 'Đối tác chiến lược trong lĩnh vực đấu giá đồ cổ.' },
        { name: 'Công ty B', description: 'Khách hàng tiêu biểu với nhiều giao dịch thành công.' },
        { name: 'Công ty C', description: 'Hỗ trợ đấu giá trang sức và đồ xa xỉ.' },
    ];

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