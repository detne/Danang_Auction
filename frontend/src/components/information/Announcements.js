import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { formatDate } from '../../utils/formatDate';
import '../../styles/Announcements.css';

// Import ảnh từ src/assets/Announcement (thêm nhiều hơn nếu cần)
import ThongBaoLichDauGiaImg from '../../assets/Announcement/ThongBaoLichDauGia.jpg';
import Taisan1Img from '../../assets/Announcement/taisan1.jpg';
import LoCaopDongImg from '../../assets/Announcement/LoCaopDong.jpg';
import LoDongThuHoiImg from '../../assets/Announcement/LoDongThuHoi.jpg';
import LoOtoImg from '../../assets/Announcement/LoOto.jpg';
import BaoMatImg from '../../assets/Announcement/BaoMat.jpg';
import BaoTriImg from '../../assets/Announcement/BaoTri.png';
import BaoTriHTImg from '../../assets/Announcement/BaoTriHeThong.jpg';
import PRBImg from '../../assets/Announcement/PressReleaseBlockchain.jpg';
// Thêm import khác nếu bạn có nhiều ảnh hơn

const Announcements = () => {
    const [news, setNews] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
    const itemsPerPage = 15;
    const { user } = useUser();

    // Mảng ảnh imported (lặp lại ngẫu nhiên cho 50 items)
    const importedImages = [
        ThongBaoLichDauGiaImg,
        Taisan1Img,
        LoCaopDongImg,
        LoDongThuHoiImg,
        LoOtoImg,
        BaoMatImg,
        BaoTriImg,
        BaoTriHTImg,
        PRBImg
        // Thêm import khác nếu bạn có nhiều ảnh hơn
    ];

    // Mock data: 50 items với imageUrl là imported image ngẫu nhiên
    const mockNews = Array.from({ length: 50 }, (_, index) => {
        const id = index + 1;
        const categoriesList = ['News', 'Update', 'Event'];
        const randomCategory = categoriesList[Math.floor(Math.random() * categoriesList.length)];
        const date = new Date(2025, 6, 18 - (id % 30));
        const randomImage = importedImages[Math.floor(Math.random() * importedImages.length)]; // Chọn ngẫu nhiên từ mảng
        return {
            id,
            title: `Thông báo ${id}`,
            description: `Mô tả chi tiết về thông báo ${id} với nội dung dài để test overflow và cân đối. Nội dung bổ sung: Đây là thông báo mẫu cho category ${randomCategory}.`,
            date: date.toISOString().split('T')[0],
            imageUrl: randomImage, // Gán imported image
            category: randomCategory,
        };
    });

    useEffect(() => {
        setNews(mockNews);
        const uniqueCats = [...new Set(mockNews.map(item => item.category || 'Uncategorized'))];
        setCategories(['all', ...uniqueCats]);
    }, []);

    const filteredNews = useMemo(() => {
        return (news || []).filter(item => {
            const matchesSearch = (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.description || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategory, news]);

    useEffect(() => {
        document.body.classList.toggle('dark-mode', darkMode);
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentNews = filteredNews.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Logic pagination với ellipsis (giữ nguyên)
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
        <div className={`announcements-section ${darkMode ? 'dark' : ''}`}>
            <div className="page-header-3">
                <div className="header-content-3">
                    <h1 className="section-title-3">Thông Báo</h1>
                    <div className="breadcrumb-3">
                        <Link to="/">Trang chủ</Link>
                        <span className="breadcrumb-separator-3">/</span>
                        <span>Thông Báo</span>
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
                    <div className="announcement-grid">
                        {currentNews.map((item) => (
                            <div key={item.id} className="announcement-card fade-in">
                                <img src={item.imageUrl || ThongBaoLichDauGiaImg} alt={item.title} className="card-image" /> {/* Fallback dùng ảnh đầu tiên */}
                                <div className="card-content">
                                    <h3 className="card-title">{item.title}</h3>
                                    <p className="card-date">{formatDate(item.date)}</p>
                                    <p className="card-excerpt">{(item.description || '').slice(0, 100)}...</p>
                                    <button className="read-more-btn">Đọc thêm</button>
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

export default Announcements;