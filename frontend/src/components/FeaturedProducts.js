import React from 'react';
import Tranh_co from '../assets/FeaturedProducts/Tranh_co.png';
import Dong_ho_vang from '../assets/FeaturedProducts/Dong_ho_vang.png';
import Nhan_kim_cuong from '../assets/FeaturedProducts/Nhan_kim_cuong.png';
import Dien_thoai_cu from '../assets/FeaturedProducts/Dien_thoai_cu.png';
import '../styles/FeaturedProducts.css';

const FeaturedProducts = () => {
    const products = [
        { name: 'Tranh cổ', price: '5,000,000 VNĐ', image: Tranh_co, timeLeft: '2 ngày' },
        { name: 'Đồng hồ vàng', price: '15,000,000 VNĐ', image: Dong_ho_vang, timeLeft: '1 ngày' },
        { name: 'Nhẫn kim cương', price: '25,000,000 VNĐ', image: Nhan_kim_cuong, timeLeft: '3 giờ' },
        { name: 'Điện thoại cũ', price: '8,000,000 VNĐ', image: Dien_thoai_cu, timeLeft: '5 giờ' },
    ];

    return (
        <section className="featured-products">
            <h2>Tài sản sắp được đấu giá</h2>
            <div className="products">
                {products.map((product, index) => (
                    <div key={index} className="product">
                        <img src={product.image} alt={product.name} />
                        <h3>{product.name}</h3>
                        <p className="price">{product.price}</p>
                        <p className="time-left">Thời gian còn lại: {product.timeLeft}</p>
                        <button>Đấu giá ngay</button>
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