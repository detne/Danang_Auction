import React from 'react';
import { Link } from 'react-router-dom';
import usePartners from '../../hooks/homepage/usePartners';
import '../../styles/PartnersSection.css';

const PartnersSection = () => {
    const { partners, loading, error } = usePartners();

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;

    return (
        <section className="partners-section">
            <h2>Đối tác của chúng tôi</h2>
            <div className="partners-list">
                {partners.length > 0 ? (
                    partners.map((partner, idx) => (
                        <div key={idx} className="partner-item">
                            <h3>{partner.name}</h3>
                            <p>{partner.description}</p>
                        </div>
                    ))
                ) : (
                    <p>Không có đối tác nào để hiển thị.</p>
                )}
            </div>
        </section>
    );
};

export default PartnersSection;