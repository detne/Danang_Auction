import React from 'react';
import Dau_gia from '../assets/NewsSection/Dau_gia.png';
import Dong_ho from '../assets/NewsSection/Dong_ho.png';
import Tranh from '../assets/NewsSection/Tranh.png';
import '../styles/NewsSection.css';

const NewsSection = () => {
    const news = [
        { title: 'Đấu giá thành công bức tranh cổ', date: '25/05/2025', image: Tranh },
        { title: 'Sắp mở đấu giá đồng hồ vàng hiếm', date: '26/05/2025', image: Dong_ho },
        { title: 'Hướng dẫn tham gia đấu giá trực tuyến', date: '27/05/2025', image: Dau_gia },
    ];

    return (
        <section className="news-section">
            <h2>Tin tức mới nhất</h2>
            <div className="news-items">
                {news.map((item, index) => (
                    <div key={index} className="news-item">
                        <img src={item.image} alt={item.title} />
                        <div className="news-content">
                            <h3>{item.title}</h3>
                            <p className="date">{item.date}</p>
                            <button>Xem chi tiết</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="view-all-container">
                <a href="#all-news" className="view-all-btn">Xem tất cả</a>
            </div>
        </section>
    );
};

export default NewsSection;