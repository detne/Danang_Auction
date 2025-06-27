import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/OtherNews.css';
import Taisan1Img from '../assets/Announcement/taisan1.jpg';

const OtherNews = () => {
    const mockOtherNews = [
        {
            id: 1,
            title: "Tin tức về xu hướng đấu giá 2025",
            date: "01/02/2025",
            description: "Cập nhật các xu hướng mới trong lĩnh vực đấu giá trực tuyến năm 2025.",
            imageUrl: Taisan1Img
        },
        {
            id: 2,
            title: "Sự kiện đấu giá từ thiện",
            date: "15/02/2025",
            description: "Thông tin về sự kiện đấu giá từ thiện sắp tới tại Đà Nẵng.",
            imageUrl: Taisan1Img
        },
        {
            id: 3,
            title: "Hướng dẫn tham gia đấu giá trực tuyến",
            date: "20/02/2025",
            description: "Hướng dẫn chi tiết cho người mới bắt đầu tham gia đấu giá trực tuyến.",
            imageUrl: Taisan1Img
        }
    ];

    const newsItems = [
        "Tin tức về sự kiện đấu giá từ thiện lần 2",
        "Cập nhật xu hướng đấu giá 2026",
        "Hướng dẫn nâng cao cho người dùng mới"
    ];

    const [otherNews, setOtherNews] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        setOtherNews(mockOtherNews);
    }, []);

    const filteredNews = otherNews.filter(news =>
        news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        news.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentNews = filteredNews.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="ongoing-auctions-section">
            <div className="page-header">
                <div className="header-content">
                    <h1 className="section-title">Tin Khác</h1>
                    <div className="breadcrumb">
                        <Link to="/">Trang chủ</Link>
                        <span className="breadcrumb-separator">/</span>
                        <span>Tin Khác</span>
                    </div>
                </div>
            </div>

            <div className="main-content">
                <div className="sidebar">
                    <div className="filter-section">
                        <h3>Tìm kiếm</h3>
                        <input
                            type="text"
                            placeholder="Nhập từ khóa"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <button className="filter-btn">Tìm kiếm</button>
                    </div>
                    <div className="filter-section">
                        <h3>Tin tức mới</h3>
                        <div className="news-list">
                            {newsItems.map((news, index) => (
                                <div key={index} className="filter-option">
                                    <span>{news}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="content-area">
                    <div className="content-header">
                    </div>
                    <div className="auction-grid">
                        {currentNews.map((news) => (
                            <div className="auction-card" key={news.id}>
                                <div className="auction-image-container">
                                    <img src={news.imageUrl} alt={news.title} className="auction-image" />
                                </div>
                                <div className="auction-content">
                                    <div className="auction-details">
                                        <div className="auction-time">
                                            Thời gian: <strong>{news.date}</strong>
                                        </div>
                                    </div>
                                    <h3 className="auction-title">{news.title}</h3>
                                    <button className="detail-btn">Xem chi tiết</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pagination">
                        <button
                            className="pagination-btn"
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Trước
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                                onClick={() => paginate(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            className="pagination-btn"
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Tiếp
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OtherNews;
