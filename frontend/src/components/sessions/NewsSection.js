import React from 'react';
import { Link } from 'react-router-dom';
import useNewsSection from '../../hooks/homepage/useNewsSection';
import '../../styles/NewsSection.css';

const NewsSection = () => {
    const { news, loading, error } = useNewsSection();

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;

    return (
        <section className="news-section">
            <h2>Tin tức mới nhất</h2>
            <div className="news-items">
                {news.length > 0 ? (
                    news.map((item, index) => (
                        <div key={index} className="news-item">
                            <img src={item.imageUrl || item.image} alt={item.title} />
                            <div className="news-content">
                                <h3>{item.title}</h3>
                                <p className="date">{item.date}</p>
                                <button>Xem chi tiết</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Không có tin tức nào để hiển thị.</p>
                )}
            </div>
            <div className="view-all-container">
                <Link to="/news" className="view-all-btn">Xem tất cả</Link>
            </div>
        </section>
    );
};

export default NewsSection;