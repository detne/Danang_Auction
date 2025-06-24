import React, { useEffect, useState } from 'react';
import { getPastAuctions } from '../services/api';
import '../styles/PastAuctionsSection.css';

const PastAuctionsSection = () => {
    const [soldItems, setSoldItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getPastAuctions();
                const validItems = Array.isArray(data) ? data : [];
                setSoldItems(validItems);
            } catch (error) {
                console.error('Lỗi khi tải tài sản đã đấu giá:', error);
                setSoldItems([]);
            }
        };
        fetchData();
    }, []);

    return (
        <section className="sold-assets">
            <h2>Tài sản đã đấu giá</h2>
            <div className="sold-items">
                {soldItems.map((item, index) => (
                    <div key={index} className="sold-item">
                        <img src={item.imageUrl} alt={item.name} />
                        <h3>{item.name}</h3>
                        <p className="final-price">
                            Giá cuối cùng: {item.finalPrice?.toLocaleString()} VNĐ
                        </p>
                        <p className="sold-date">Ngày đấu giá: {item.soldDate}</p>
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