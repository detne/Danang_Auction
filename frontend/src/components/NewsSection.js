import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNews } from '../services/api';
import Dau_gia from '../assets/NewsSection/Dau_gia.png';
import Dong_ho from '../assets/NewsSection/Dong_ho.png';
import Tranh from '../assets/NewsSection/Tranh.png';
import '../styles/NewsSection.css';

const NewsSection = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Dữ liệu tĩnh làm fallback
    const fallbackNews = [
        { title: 'Đấu giá thành công bức tranh cổ', date: '25/05/2025', image: Tranh },
        { title: 'Sắp mở đấu giá đồng hồ vàng hiếm', date: '26/05/2025', image: Dong_ho },
        { title: 'Hướng dẫn tham gia đấu giá trực tuyến', date: '27/05/2025', image: Dau_gia },
    ];

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                const response = await getNews();
                const newsList = Array.isArray(response?.data) ? response.data : [];
                const enrichedNews = newsList.map(item => ({
                    title: item.title || 'Tin tức không tên',
                    date: item.date || new Date().toLocaleDateString('vi-VN'),
                    imageUrl: item.imageUrl || (item.imageFile ? `/assets/NewsSection/${item.imageFile}` : null),
                })).filter(item => item.imageUrl); // Loại bỏ tin không có ảnh
                setNews(enrichedNews.length > 0 ? enrichedNews : fallbackNews);
            } catch (error) {
                console.error('Lỗi khi tải tin tức:', error);
                setError('Không thể tải tin tức từ server. Sử dụng dữ liệu mặc định.');
                setNews(fallbackNews);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

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
                <Link to="/news" className="view-all-btn">Xem tất cả</Link> {/* Điều hướng tới trang tin tức */}
            </div>
        </section>
    );
};

export default NewsSection;