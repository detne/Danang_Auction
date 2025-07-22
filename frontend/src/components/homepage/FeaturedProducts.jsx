import React from 'react';
import { Link } from 'react-router-dom';
import useFeaturedProducts from '../../hooks/homepage/useFeaturedProducts';
import '../../styles/FeaturedProducts.css';

const FeaturedProducts = () => {
    const { assets, loading, error } = useFeaturedProducts();

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div className="error-text">{error}</div>;

    return (
        <section className="featured-products">
            <h2>Tài sản sắp được đấu giá</h2>
            <div className="products">
                {assets.length > 0 ? (
                    assets.map((item) => (
                        <div key={item.id} className="product">
                            <img src={item.image} alt={item.name} />
                            <h3>{item.name}</h3>
                            <p className="price">{item.price.toLocaleString('vi-VN')} VNĐ</p>
                            <p className={`time-left ${item.isEnded ? 'expired' : ''}`}>
                                Thời gian còn lại: {item.timeLeftLabel}
                            </p>
                            {item.isEnded ? (
                                <button className="disabled" disabled>Đã kết thúc</button>
                            ) : (
                                <Link to={`/asset/${item.id}`} className="btn-view-detail">Chi tiết</Link>
                            )}
                        </div>
                    ))
                ) : (
                    <p>Không có sản phẩm nào để hiển thị.</p>
                )}
            </div>

            <div className="view-all-container">
                <Link to="/upcoming-auctions" className="view-all-btn">
                    Xem tất cả
                </Link>
            </div>
        </section>
    );
};

export default FeaturedProducts;