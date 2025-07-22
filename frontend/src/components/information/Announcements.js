import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Announcements.css';
import PressReleaseBlockchainImg from '../../assets/Announcement/PressReleaseBlockchain.jpg';
import BaoMatImg from '../../assets/Announcement/BaoMat.jpg';
import BaoTriImg from '../../assets/Announcement/BaoTri.png';
import BaoTriHeThongImg from '../../assets/Announcement/BaoTriHeThong.jpg';
import CapNhatImg from '../../assets/Announcement/CapNhat.png';
import ChinhSachImg from '../../assets/Announcement/ChinhSach.jpg';
import ThongBaoImg from '../../assets/Announcement/ThongBao.jpg';

const Announcements = () => {
    const mockAnnouncements = [
        {
            id: 1,
            title: "Press Release Blockchain",
            date: "25/11/2023",
            description: "Thông báo về ứng dụng công nghệ Blockchain vào đấu giá.",
            imageUrl: PressReleaseBlockchainImg
        },
        {
            id: 2,
            title: "Thông cáo báo chí: Lạc Việt tiên phong ứng dụng công nghệ Blockchain vào đấu giá trực tuyến tại Việt Nam",
            date: "06/08/2023",
            description: "Thông báo về việc bảo trì và nâng cấp hệ thống đấu giá.",
            imageUrl: ThongBaoImg
        },
        {
            id: 3,
            title: "Thông báo về việc nâng cấp hệ thống đấu giá",
            date: "28/04/2023",
            description: "Thông báo về việc nâng cấp hệ thống đấu giá trực tuyến.",
            imageUrl: BaoTriImg
        },
        {
            id: 4,
            title: "THÔNG BÁO TẠM HOÃN ĐẤU GIÁ TÀI SẢN",
            date: "29/04/2022",
            description: "Thông báo về bảo trì định kỳ hệ thống đấu giá.",
            imageUrl: BaoTriHeThongImg
        },
        {
            id: 5,
            title: "Thông báo về việc dừng tổ chức cuộc đấu giá tài sản - tích thu do vi phạm hành chính của Cục QLTT Hà Giang",
            date: "15/09/2021",
            description: "Thông báo về các thay đổi trong chính sách đấu giá.",
            imageUrl: ChinhSachImg
        },
        {
            id: 6,
            title: "Thông báo về việc dừng tổ chức cuộc đấu giá tài sản - Máy xúi đất không có lồng bảo vệ và đầu máy xúi đất của Cục QLTT Hà Giang",
            date: "15/09/2021",
            description: "Thông báo về cập nhật phiên bản phần mềm đấu giá mới.",
            imageUrl: CapNhatImg
        },
        {
            id: 7,
            title: "Thông báo danh sách khách hàng không đủ điều kiện tham gia đấu giá tài sản VT Bắc Ninh đợt 1 năm 2021",
            date: "20/03/2021",
            description: "Thông báo về các biện pháp bảo mật mới áp dụng cho hệ thống.",
            imageUrl: BaoMatImg
        },
        {
            id: 8,
            title: "Công bố hệ thống đấu giá trực tuyến Lạc Việt",
            date: "30/04/2020",
            description: "Thông báo về hệ thống đấu giá trực tuyến.",
            imageUrl: BaoMatImg
        }
    ];

    const newsItems = [
        "TBDG_LV - Lô 01 xe ô tô tải ISUZU gần cầu hết niên hạn sử dụng",
        "TBDG_LV Tài sản đấu giá đợt 1/2025 gồm các động, tài sản của Công ty Cổ phần Cao su Hòa Bình",
        "TBDG_LV - Lô cáp đồng thủ hồi, tồn kho cũ hỏng, không đủ tiêu chuẩn sử dụng - Quy I năm 2025 và Quy II năm 2025",
        "TBDG_LV - Lô 02 chiếc xe ô tô biển kiểm soát 84L-2120 và 84L-2133"
    ];

    const [announcements, setAnnouncements] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        setAnnouncements(mockAnnouncements);
    }, []);

    const filteredAnnouncements = announcements.filter(announcement =>
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAnnouncements = filteredAnnouncements.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="ongoing-auctions-section">
            <div className="page-header">
                <div className="header-content">
                    <h1 className="section-title">Thông báo</h1>
                    <div className="breadcrumb">
                        <Link to="/">Trang chủ</Link>
                        <span className="breadcrumb-separator">/</span>
                        <span>Thông báo</span>
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
                        {currentAnnouncements.map((announcement) => (
                            <div className="auction-card" key={announcement.id}>
                                <div className="auction-image-container">
                                    <img src={announcement.imageUrl} alt={announcement.title} className="auction-image" />
                                </div>
                                <div className="auction-content">
                                    <div className="auction-details">
                                        <div className="auction-time">
                                            Thời gian: <strong>{announcement.date}</strong>
                                        </div>
                                    </div>
                                    <h3 className="auction-title">{announcement.title}</h3>
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

export default Announcements;
