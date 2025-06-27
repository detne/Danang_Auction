import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/AuctionNotices.css';
import ThongBaoLichDauGiaImg from '../assets/Announcement/ThongBaoLichDauGia.jpg';
import Taisan1Img from '../assets/Announcement/taisan1.jpg';
import LoCaopDongImg from '../assets/Announcement/LoCaopDong.jpg';
import LoDongThuHoiImg from '../assets/Announcement/LoDongThuHoi.jpg';
import LoOtoImg from '../assets/Announcement/LoOto.jpg';

const AuctionNotices = () => {
    const mockAuctionNotices = [
        {
            id: 1,
            title: "Thông báo lịch đấu giá tháng 12",
            date: "20/12/2023",
            description: "Thông báo lịch trình các phiên đấu giá vào tháng 12.",
            imageUrl: ThongBaoLichDauGiaImg
        },
        {
            id: 2,
            title: "TBDG_LV Tài sản đấu giá đợt 1/2025",
            date: "01/01/2025",
            description: "TBDG_LV Tài sản đấu giá đợt 1/2025 gồm cấp đồng, tài sản cũ...",
            imageUrl: Taisan1Img
        },
        {
            id: 3,
            title: "TBDG_LV Lô cáp đồng đã qua sử dụng",
            date: "05/01/2025",
            description: "TBDG_LV Lô cáp đồng đã qua sử dụng – đợt 1 năm 2025...",
            imageUrl: LoCaopDongImg
        },
        {
            id: 4,
            title: "TBDG_LV Lô cáp đồng thu hồi",
            date: "10/01/2025",
            description: "TBDG_LV Lô cáp đồng thu hồi, tồn kho cũ hỏng, không đủ tiêu chuẩn...",
            imageUrl: LoDongThuHoiImg
        },
        {
            id: 5,
            title: "TBDG_LV Lô 02 chiếc xe ô tô",
            date: "15/01/2025",
            description: "TBDG_LV Lô 02 chiếc xe ô tô biển kiểm soát 84L-2120...",
            imageUrl: LoOtoImg
        }
    ];

    const newsItems = [
        "TBDG_LV - Lô 01 xe ô tô tải ISUZU gần cầu hết niên hạn sử dụng",
        "TBDG_LV Tài sản đấu giá đợt 2/2025",
        "TBDG_LV - Lô cáp đồng thu hồi đợt 2 năm 2025"
    ];

    const [auctionNotices, setAuctionNotices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        setAuctionNotices(mockAuctionNotices);
    }, []);

    const filteredNotices = auctionNotices.filter(notice =>
        notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentNotices = filteredNotices.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="ongoing-auctions-section">
            <div className="page-header">
                <div className="header-content">
                    <h1 className="section-title">Thông Báo Đấu Giá</h1>
                    <div className="breadcrumb">
                        <Link to="/">Trang chủ</Link>
                        <span className="breadcrumb-separator">/</span>
                        <span>Thông Báo Đấu Giá</span>
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
                        {currentNotices.map((notice) => (
                            <div className="auction-card" key={notice.id}>
                                <div className="auction-image-container">
                                    <img src={notice.imageUrl} alt={notice.title} className="auction-image" />
                                </div>
                                <div className="auction-content">
                                    <div className="auction-details">
                                        <div className="auction-time">
                                            Thời gian: <strong>{notice.date}</strong>
                                        </div>
                                    </div>
                                    <h3 className="auction-title">{notice.title}</h3>
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

export default AuctionNotices;
