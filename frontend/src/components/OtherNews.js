// src/components/information/OtherNews.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { formatDate } from '../utils/formatDate'; // Giả sử bạn có util này, nếu không thì dùng news.date trực tiếp
import '../styles/OtherNews.css';

// Import ảnh từ src/assets/Announcement
import Taisan1Img from '../assets/Announcement/taisan1.jpg';

const OtherNews = () => {
    const [otherNews, setOtherNews] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
    const itemsPerPage = 15;
    const { user } = useUser();

    // Mảng ảnh imported (lặp lại ngẫu nhiên cho 50 items)
    const importedImages = [
        Taisan1Img, // Chỉ có 1 ảnh, sẽ lặp lại ngẫu nhiên
    ];

    // Mock data: 50 items đa dạng
    const mockOtherNews = Array.from({ length: 50 }, (_, index) => {
        const id = index + 1;
        const categoriesList = ['News', 'Update', 'Event'];
        const randomCategory = categoriesList[Math.floor(Math.random() * categoriesList.length)];
        const date = new Date(2025, 6, 18 - (id % 30)); // Ngày đa dạng từ 2025-07-18
        const randomImage = importedImages[Math.floor(Math.random() * importedImages.length)];
        return {
            id,
            title: `Tin tức ${id}`,
            description: `Mô tả chi tiết về tin tức ${id} với nội dung dài để test overflow. Nội dung bổ sung: Đây là tin mẫu cho category ${randomCategory}.`,
            date: date.toISOString().split('T')[0],
            imageUrl: randomImage,
            category: randomCategory,
        };
    });

    useEffect(() => {
        setOtherNews(mockOtherNews);
        const uniqueCats = [...new Set(mockOtherNews.map(item => item.category || 'Uncategorized'))];
        setCategories(['all', ...uniqueCats]);
    }, []);

    const filteredNews = useMemo(() => {
        return (otherNews || []).filter(item => {
            const matchesSearch = (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.description || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategory, otherNews]);

    useEffect(() => {
        document.body.classList.toggle('dark-mode', darkMode);
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentNews = filteredNews.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Logic pagination với ellipsis
    const getPaginationItems = () => {
        const pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('...');
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            if (currentPage < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className={`ongoing-auctions-section ${darkMode ? 'dark' : ''}`}>
            <div className="page-header-1">
                <div className="header-content-1">
                    <h1 className="section-title-1">Tin Khác</h1>
                    <div className="breadcrumb-1">
                        <Link to="/">Trang chủ</Link>
                        <span className="breadcrumb-separator-1">/</span>
                        <span>Tin Khác</span>
                    </div>
                </div>
                {user?.role === 'ADMIN' && (
                    <button className="create-btn">+ Tạo thông báo mới</button>
                )}
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
                        <h3>Danh mục</h3>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="category-select"
                        >
                            {categories.map((cat, index) => (
                                <option key={`${cat}-${index}`} value={cat}>
                                    {cat === 'all' ? 'Tất cả' : cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="content-area">
                    <div className="announcement-grid"> {/* Đổi tên class để khớp CSS */}
                        {currentNews.map((news) => (
                            <div key={news.id} className="announcement-card fade-in"> {/* Đổi tên class */}
                                <img src={news.imageUrl || Taisan1Img} alt={news.title} className="card-image" />
                                <div className="card-content">
                                    <h3 className="card-title">{news.title}</h3>
                                    <p className="card-date">{formatDate(news.date)}</p> {/* Hoặc news.date nếu không có formatDate */}
                                    <p className="card-excerpt">{(news.description || '').slice(0, 100)}...</p>
                                    <button className="read-more-btn">Đọc thêm</button> {/* Thay đổi button */}
                                </div>
                            </div>
                        ))}
                    </div>
                    {filteredNews.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon">📢</div>
                            <h3>Không có thông báo nào</h3>
                            <p>Thử thay đổi bộ lọc hoặc quay lại sau.</p>
                        </div>
                    )}
                    <div className="pagination">
                        <button
                            className="pagination-btn"
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Trước
                        </button>
                        {getPaginationItems().map((page, index) => (
                            <button
                                key={index}
                                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                                onClick={() => typeof page === 'number' && paginate(page)}
                                disabled={typeof page !== 'number'}
                            >
                                {page}
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