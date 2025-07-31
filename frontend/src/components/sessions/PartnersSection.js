import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import usePartners from '../../hooks/homepage/usePartners';
import '../../styles/PartnersSection.css';

const PartnersSection = () => {
    const { partners, loading, error } = usePartners();
    const [currentSlide, setCurrentSlide] = useState(0);

    // Dữ liệu đối tác mặc định (nếu không có từ API)
    const partnersData = [
        { name: 'BIDV Bank', logo: '/images/partners/bidv.png' },
        { name: 'Samsung', logo: '/images/partners/samsung.png' },
        { name: 'SHB', logo: '/images/partners/shb.png' },
        { name: 'VAMC', logo: '/images/partners/vamc.png' },
        { name: 'VIB', logo: '/images/partners/vib.png' },
        { name: 'Vietcombank', logo: '/images/partners/vietcombank.png' },
        { name: 'VietinBank', logo: '/images/partners/vietinbank.png' },
        { name: 'VNPT', logo: '/images/partners/vnpt.png' },
        { name: 'VPBank', logo: '/images/partners/vpbank.png' },
        { name: 'EVN', logo: '/images/partners/evn.png' },       // thêm mới
        { name: 'HUD', logo: '/images/partners/hud.png' },        // thêm mới
        { name: 'Bộ Công Thương', logo: '/images/partners/moit.png' }, // thêm mới
    ];



    if (loading) return <div>Đang tải...</div>;
    if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;

    // Sử dụng dữ liệu thật nếu có từ API, không thì dùng dữ liệu cố định
    const displayPartners = partnersData;

    // Chia thành các nhóm 12 (2 hàng x 6 cột)
    const partnersPerSlide = 12;
    const totalSlides = Math.ceil(displayPartners.length / partnersPerSlide);
    const currentPartners = displayPartners.slice(
        currentSlide * partnersPerSlide,
        (currentSlide + 1) * partnersPerSlide
    );

    const handleDotClick = (index) => {
        setCurrentSlide(index);
    };

    return (
        <section className="partners-section">
            <h2>Khách hàng & đối tác tiêu biểu</h2>
            <div className="partners-list">
                {currentPartners.map((partner, idx) => (
                    <div key={idx} className="partner-item">
                        <div className="partner-logo">
                            {partner.logo ? (
                                <img
                                    src={partner.logo}
                                    alt={partner.name}
                                    style={{ maxWidth: '100%', maxHeight: '60px', objectFit: 'contain' }}
                                    onError={(e) => {
                                        console.log('Image load error for:', partner.name);
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                    }}
                                    onLoad={() => {
                                        // Có thể bỏ log này nếu không cần
                                        // console.log('Image loaded successfully for:', partner.name);
                                    }}
                                />
                            ) : null}
                            <div
                                className="partner-name"
                                style={{ display: partner.logo ? 'none' : 'block' }}
                            >
                                {partner.name}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Dots indicator nếu có nhiều slide */}
            {totalSlides > 1 && (
                <div className="partners-dots">
                    {Array.from({ length: totalSlides }, (_, index) => (
                        <div
                            key={index}
                            className={`dot ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => handleDotClick(index)}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default PartnersSection;