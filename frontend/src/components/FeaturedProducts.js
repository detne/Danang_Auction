import React from 'react';
import { useNavigate } from 'react-router-dom';
import Tranh_co from '../assets/FeaturedProducts/Tranh_co.png';
import Dong_ho_vang from '../assets/FeaturedProducts/Dong_ho_vang.png';
import Nhan_kim_cuong from '../assets/FeaturedProducts/Nhan_kim_cuong.png';
import Dien_thoai_cu from '../assets/FeaturedProducts/Dien_thoai_cu.png';
import '../styles/FeaturedProducts.css';

const FeaturedProducts = () => {
    const navigate = useNavigate();

    const products = [
        {
            id: 1,
            name: 'Tranh cổ',
            price: '5,000,000 VNĐ',
            image: Tranh_co,
            endTime: new Date('2025-06-10T23:59:59+07:00'),
        },
        {
            id: 2,
            name: 'Đồng hồ vàng',
            price: '15,000,000 VNĐ',
            image: Dong_ho_vang,
            endTime: new Date('2025-06-09T23:59:59+07:00'),
        },
        {
            id: 3,
            name: 'Nhẫn kim cương',
            price: '25,000,000 VNĐ',
            image: Nhan_kim_cuong,
            endTime: new Date('2025-06-09T14:55:00+07:00'),
        },
        {
            id: 4,
            name: 'Điện thoại cũ',
            price: '8,000,000 VNĐ',
            image: Dien_thoai_cu,
            endTime: new Date('2025-06-09T16:55:00+07:00'),
        },
    ];

    const getTimeLeft = (endTime) => {
        const now = new Date();
        const diff = endTime - now;
        if (diff <= 0) return 'Đã kết thúc';
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return days > 0 ? `${days} ngày` : `${hours} giờ ${minutes} phút`;
    };

    return (
        <section className="featured-products">
            <h2>Tài sản sắp được đấu giá</h2>
            <div className="products">
                {products.map((product) => (
                    <div key={product.id} className="product">
                        <img src={product.image} alt={product.name} />
                        <h3>{product.name}</h3>
                        <p className="price">{product.price}</p>
                        <p className="time-left">Thời gian còn lại: {getTimeLeft(product.endTime)}</p>
                        <button onClick={() => navigate(`/asset/${product.id}`)}>Chi tiết</button>
                    </div>
                ))}
            </div>
            <div className="view-all-container">
                <a href="#all-upcoming-auctions" className="view-all-btn">Xem tất cả</a>
            </div>
        </section>
    );
};

export default FeaturedProducts;