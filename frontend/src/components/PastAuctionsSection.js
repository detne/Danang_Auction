import React from 'react';
import Tuong_dong_co from '../assets/PastAuctionsSection/Tuong_dong_co.png';
import Binh_gom_co from '../assets/PastAuctionsSection/Binh_gom_co.png';
import Den_chum_pha_le from '../assets/PastAuctionsSection/Den_chum_pha_le.png';
import Bo_ban_ghe_go_mun from '../assets/PastAuctionsSection/Bo_ban_ghe_go_mun.png';
import '../styles/PastAuctionsSection.css';

const PastAuctionsSection = () => {
    const soldItems = [
        { name: 'Tượng đồng cổ', finalPrice: '15,000,000 VNĐ', image: Tuong_dong_co, soldDate: '05/05/2025' },
        { name: 'Bình gốm cổ', finalPrice: '8,000,000 VNĐ', image: Binh_gom_co, soldDate: '03/05/2025' },
        { name: 'Đèn chùm pha lê', finalPrice: '22,000,000 VNĐ', image: Den_chum_pha_le, soldDate: '01/05/2025' },
        { name: 'Bộ bàn ghế gỗ mun', finalPrice: '35,000,000 VNĐ', image: Bo_ban_ghe_go_mun, soldDate: '28/04/2025' },
    ];

    return (
        <section className="sold-assets">
            <h2>Tài sản đã đấu giá</h2>
            <div className="sold-items">
                {soldItems.map((item, index) => (
                    <div key={index} className="sold-item">
                        <img src={item.image} alt={item.name} />
                        <h3>{item.name}</h3>
                        <p className="final-price">Giá cuối cùng: {item.finalPrice}</p>
                        <p className="sold-date">Ngày đấu giá: {item.soldDate}</p>
                        <button>Chi tiết</button>
                    </div>
                ))}
            </div>
            <div className="view-all-container">
                <a href="#all-past-auctions" className="view-all-btn">Xem tất cả</a>
            </div>
        </section>
    );
};

export default PastAuctionsSection;