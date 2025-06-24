import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPastAuctions } from '../services/api';
import Tuong_dong_co from '../assets/PastAuctionsSection/Tuong_dong_co.png';
import Binh_gom_co from '../assets/PastAuctionsSection/Binh_gom_co.png';
import Den_chum_pha_le from '../assets/PastAuctionsSection/Den_chum_pha_le.png';
import Bo_ban_ghe_go_mun from '../assets/PastAuctionsSection/Bo_ban_ghe_go_mun.png';
import '../styles/PastAuctionsSection.css';

const PastAuctionsSection = () => {
    const [soldItems, setSoldItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Dữ liệu tĩnh làm fallback
    const fallbackItems = [
        { name: 'Tượng đồng cổ', finalPrice: 15000000, image: Tuong_dong_co, soldDate: '05/05/2025' },
        { name: 'Bình gốm cổ', finalPrice: 8000000, image: Binh_gom_co, soldDate: '03/05/2025' },
        { name: 'Đèn chùm pha lê', finalPrice: 22000000, image: Den_chum_pha_le, soldDate: '01/05/2025' },
        { name: 'Bộ bàn ghế gỗ mun', finalPrice: 35000000, image: Bo_ban_ghe_go_mun, soldDate: '28/04/2025' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getPastAuctions();
                const validItems = Array.isArray(data) ? data : [];
                const enrichedItems = validItems.map(item => ({
                    name: item.name || 'Tài sản không tên',
                    finalPrice: item.finalPrice || 0,
                    imageUrl: item.imageUrl || (item.imageFile ? `/assets/PastAuctionsSection/${item.imageFile}` : null),
                    soldDate: item.soldDate || new Date().toLocaleDateString('vi-VN'),
                })).filter(item => item.imageUrl); // Loại bỏ mục không có ảnh
                setSoldItems(enrichedItems.length > 0 ? enrichedItems : fallbackItems);
            } catch (error) {
                console.error('Lỗi khi tải tài sản đã đấu giá:', error);
                setError('Không thể tải dữ liệu từ server. Sử dụng dữ liệu mặc định.');
                setSoldItems(fallbackItems);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;

    return (
        <section className="sold-assets">
            <h2>Tài sản đã đấu giá</h2>
            <div className="sold-items">
                {soldItems.length > 0 ? (
                    soldItems.map((item, index) => (
                        <div key={index} className="sold-item">
                            <img src={item.imageUrl || item.image} alt={item.name} />
                            <h3>{item.name}</h3>
                            <p className="final-price">Giá cuối cùng: {item.finalPrice.toLocaleString()} VNĐ</p>
                            <p className="sold-date">Ngày đấu giá: {item.soldDate}</p>
                            <button>Chi tiết</button>
                        </div>
                    ))
                ) : (
                    <p>Không có sản phẩm nào để hiển thị.</p>
                )}
            </div>
            <div className="view-all-container">
                <Link to="/ended-auctions" className="view-all-btn">Xem tất cả</Link>
            </div>
        </section>
    );
};

export default PastAuctionsSection;