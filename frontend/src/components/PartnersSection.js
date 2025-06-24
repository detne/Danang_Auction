import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPartners } from '../services/api';
import '../styles/PartnersSection.css';

const PartnersSection = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Dữ liệu tĩnh làm fallback
    const fallbackPartners = [
        { name: 'Công ty A', description: 'Đối tác chiến lược trong lĩnh vực đấu giá đồ cổ.' },
        { name: 'Công ty B', description: 'Khách hàng tiêu biểu với nhiều giao dịch thành công.' },
        { name: 'Công ty C', description: 'Hỗ trợ đấu giá trang sức và đồ xa xỉ.' },
    ];

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                setLoading(true);
                const data = await getPartners();
                const validData = Array.isArray(data) ? data : [];
                const enrichedPartners = validData.map(item => ({
                    name: item.name || 'Đối tác không tên',
                    description: item.description || 'Không có mô tả',
                }));
                setPartners(enrichedPartners.length > 0 ? enrichedPartners : fallbackPartners);
            } catch (error) {
                console.error('Lỗi khi tải đối tác:', error);
                setError('Không thể tải dữ liệu từ server. Sử dụng dữ liệu mặc định.');
                setPartners(fallbackPartners);
            } finally {
                setLoading(false);
            }
        };

        fetchPartners();
    }, []);

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;

    return (
        <section className="partners-section">
            <h2>Khách hàng & đối tác tiêu biểu</h2>
            <div className="partners">
                {partners.length > 0 ? (
                    partners.map((partner, index) => (
                        <div key={index} className="partner">
                            <h3>{partner.name}</h3>
                            <p>{partner.description}</p>
                            <button>Xem chi tiết</button>
                        </div>
                    ))
                ) : (
                    <p>Không có đối tác nào để hiển thị.</p>
                )}
            </div>
            <div className="view-all-container">
                <Link to="/partners" className="view-all-btn">Xem tất cả</Link>
            </div>
        </section>
    );
};

export default PartnersSection;