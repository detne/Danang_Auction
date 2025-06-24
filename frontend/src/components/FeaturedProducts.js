import React, { useEffect, useState } from 'react';
import { getUpcomingAssets } from '../services/api';
import '../styles/FeaturedProducts.css';

const FeaturedProducts = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getUpcomingAssets();
                const productList = Array.isArray(response?.data) ? response.data : [];
                setProducts(productList);
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu tài sản:', error);
                setProducts([]);
            }
        };
        fetchData();
    }, []);

    return (
        <section className="featured-products">
            <h2>Tài sản sắp được đấu giá</h2>
            <div className="products">
                {products.map((product, index) => (
                    <div key={index} className="product">
                        <img src={product.imageUrl} alt={product.name} />
                        <h3>{product.name}</h3>
                        <p className="price">{product.startPrice.toLocaleString()} VNĐ</p>
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