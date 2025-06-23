import React from 'react';
import banner from '../assets/banner.jpg'; // Import ảnh banner
import '../styles/Banner.css';

const Banner = () => {
    return (
        <div className="banner" style={{ backgroundImage: `url(${banner})` }}>
            <div className="banner-content">
                <h2>Chào mừng đến với DaNangAuction</h2>
                <p>Tham gia đấu giá trực tuyến dễ dàng và nhanh chóng!</p>
                <button>Khám phá ngay</button>
            </div>
        </div>
    );
};

export default Banner;