import React, { useEffect, useState } from 'react';
import { getNews } from '../services/api';
import '../styles/NewsSection.css';

const NewsSection = () => {
    const [news, setNews] = useState([]);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await getNews();
                const newsList = Array.isArray(response?.data) ? response.data : [];
                setNews(newsList);
            } catch (error) {
                console.error('Lỗi khi tải tin tức:', error);
                setNews([]);
            }
        };
        fetchNews();
    }, []);

    return (
        <section className="news-section">
            <h2>Tin tức mới nhất</h2>
            <div className="news-items">
                {news.map((item, index) => (
                    <div key={index} className="news-item">
                        <img src={item.imageUrl} alt={item.title} />
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