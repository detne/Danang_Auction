import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/OngoingAuctionsSection.css';
import useOngoingAuctions from '../../hooks/homepage/useOngoingAuctions';
import { AUCTION_STATUS, AUCTION_TYPE } from '../../utils/constants';

// Hàm map status từ backend (tiếng Anh) sang tiếng Việt
const mapStatusToVietnamese = (status) => {
    switch (status) {
        case 'ACTIVE': return 'Đang diễn ra';
        case 'UPCOMING': return 'Chưa diễn ra';
        case 'FINISHED': return 'Đã kết thúc';
        default: return status || 'Không xác định';
    }
};

const OngoingAuctionsSection = () => {
    const navigate = useNavigate();
    const [searchKeyword, setSearchKeyword] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [statusFilters, setStatusFilters] = useState({
        all: true,
        upcoming: false,
        ongoing: true,
        ended: false,
    });
    const [auctionTypeFilters, setAuctionTypeFilters] = useState({
        all: true,
        public: false,
        voluntary: false,
    });
    const [timers, setTimers] = useState({});

    // Fetch data từ hook
    const { auctions: auctionData, loading, error } = useOngoingAuctions();

    // Map data từ backend sang cấu trúc phù hợp cho UI
    const mappedAuctions = useMemo(() => {
        console.log('Mapping auction data:', auctionData); // Debug log
        return auctionData.map(auction => ({
            ...auction,
            status: mapStatusToVietnamese(auction.status),
            openTime: auction.startTime || 'Không xác định',
            closeTime: auction.endTime || 'Không xác định',
            endDateTime: auction.endTime || new Date(),
            image: auction.thumbnailUrl || '/asset-default.jpg',
            type: auction.auctionType?.toLowerCase() || 'public',
            id: auction.id,
            session_code: auction.session_code || `AUC-${auction.id}`, // Fallback nếu session_code thiếu
        }));
    }, [auctionData]);

    const handleStatusChange = (status) => {
        if (status === 'all') {
            setStatusFilters({
                all: true,
                upcoming: false,
                ongoing: false,
                ended: false,
            });
        } else {
            setStatusFilters(prev => ({
                ...prev,
                all: false,
                [status]: !prev[status],
            }));
        }
    };

    const handleAuctionTypeChange = (type) => {
        if (type === 'all') {
            setAuctionTypeFilters({
                all: true,
                public: false,
                voluntary: false,
            });
        } else {
            setAuctionTypeFilters(prev => ({
                ...prev,
                all: false,
                [type]: !prev[type],
            }));
        }
    };

    const handleFilter = () => {
        setCurrentPage(1);
    };

    // Filter auctions với useMemo để tối ưu hiệu năng
    const filteredAuctions = useMemo(() => {
        return mappedAuctions.filter(auction => {
            if (!statusFilters.all) {
                const statusMatch =
                    (statusFilters.upcoming && auction.status === 'Chưa diễn ra') ||
                    (statusFilters.ongoing && auction.status === 'Đang diễn ra') ||
                    (statusFilters.ended && auction.status === 'Đã kết thúc');
                if (!statusMatch) return false;
            }

            if (!auctionTypeFilters.all) {
                const typeMatch =
                    (auctionTypeFilters.public && auction.type === 'public') ||
                    (auctionTypeFilters.voluntary && auction.type === 'voluntary');
                if (!typeMatch) return false;
            }
            if (searchKeyword && !auction.title?.toLowerCase().includes(searchKeyword.toLowerCase())) {
                return false;
            }
            if (fromDate && new Date(auction.openTime) < new Date(fromDate)) return false;
            if (toDate && new Date(auction.closeTime) > new Date(toDate)) return false;
            return true;
        });
    }, [mappedAuctions, statusFilters, auctionTypeFilters, searchKeyword, fromDate, toDate]);

    const totalPages = Math.ceil(filteredAuctions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentAuctions = filteredAuctions.slice(startIndex, startIndex + itemsPerPage);

    const generatePageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else if (currentPage <= 3) {
            for (let i = 1; i <= 4; i++) pages.push(i);
            pages.push('...');
            pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
            pages.push(1);
            pages.push('...');
            for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            pages.push('...');
            for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
            pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    // useEffect để cập nhật timer, tối ưu để tránh vòng lặp
    useEffect(() => {
        const updateTimers = () => {
            const now = new Date().getTime();
            const newTimers = {};
            currentAuctions.forEach(auction => {
                if (auction.status === 'Đang diễn ra' || auction.status === 'Chưa diễn ra') {
                    const endTime = new Date(auction.endDateTime).getTime();
                    const timeLeft = endTime - now;
                    if (timeLeft > 0) {
                        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                        newTimers[auction.id] = { days, hours, minutes, seconds, expired: false };
                    } else {
                        newTimers[auction.id] = { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
                    }
                }
            });
            setTimers(prevTimers => {
                if (JSON.stringify(prevTimers) !== JSON.stringify(newTimers)) {
                    return newTimers;
                }
                return prevTimers;
            });
        };
        updateTimers(); // Chạy lần đầu
        const interval = setInterval(updateTimers, 1000);
        return () => clearInterval(interval);
    }, [currentAuctions]);

    const getStatusClass = (status) => {
        switch (status) {
            case 'Đang diễn ra': return 'status-ongoing';
            case 'Chưa diễn ra': return 'status-upcoming';
            case 'Đã kết thúc': return 'status-ended';
            default: return '';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'Đang diễn ra': return 'ĐANG DIỄN RA';
            case 'Chưa diễn ra': return 'CHƯA DIỄN RA';
            case 'Đã kết thúc': return 'ĐÃ KẾT THÚC';
            default: return status;
        }
    };

    const CountdownTimer = ({ auctionId, status }) => {
        const timer = timers[auctionId] || { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
        if (status === 'Đã kết thúc' || timer.expired) {
            return <div className="ended-overlay">ĐÃ KẾT THÚC</div>;
        }
        return (
            <div className="countdown-timer">
                <div className="timer-item">
                    <span className="timer-number">{timer.days.toString().padStart(2, '0')}</span>
                    <span className="timer-label">Ngày</span>
                </div>
                <div className="timer-item">
                    <span className="timer-number">{timer.hours.toString().padStart(2, '0')}</span>
                    <span className="timer-label">Giờ</span>
                </div>
                <div className="timer-item">
                    <span className="timer-number">{timer.minutes.toString().padStart(2, '0')}</span>
                    <span className="timer-label">Phút</span>
                </div>
                <div className="timer-item">
                    <span className="timer-number">{timer.seconds.toString().padStart(2, '0')}</span>
                    <span className="timer-label">Giây</span>
                </div>
            </div>
        );
    };

    const handleDetailClick = (auctionId) => {
        const auction = currentAuctions.find(a => a.id === auctionId);
        if (auction) {
            console.log('Navigating to session detail:', auction.session_code); // Debug log
            navigate(`/sessions/code/${auction.session_code}`, { state: { auction } });
        } else {
            console.log('Auction not found for id:', auctionId); // Debug nếu không tìm thấy
        }
    };

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;

    return (
        <section className="ongoing-auctions-section">
            <div className="page-header-2">
                <div className="header-content-2">
                    <h1 className="section-title-2">Danh sách Cuộc đấu giá</h1>
                    <div className="breadcrumb-2">
                        <Link to="/" style={{ textDecoration: 'none' }}>Trang chủ</Link>
                        <span className="breadcrumb-separator-2">/</span>
                        <span>Cuộc đấu giá</span>
                    </div>
                </div>
            </div>
            <div className="main-content">
                <div className="sidebar">
                    <div className="filter-section">
                        <h3>Tìm kiếm</h3>
                        <input
                            type="text"
                            placeholder="Nhập từ khóa..."
                            className="search-input"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                        <div className="date-range">
                            <label>Từ ngày</label>
                            <input
                                type="date"
                                className="date-input"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                            <label>Đến ngày</label>
                            <input
                                type="date"
                                className="date-input"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />
                        </div>
                        <button className="filter-btn" onClick={handleFilter}>LỌC</button>
                    </div>
                    <div className="filter-section">
                        <h3>Trạng thái tài sản</h3>
                        <div className="filter-options">
                            <label className="filter-option">
                                <input
                                    type="checkbox"
                                    checked={statusFilters.all}
                                    onChange={() => handleStatusChange('all')}
                                />
                                Tất cả
                            </label>
                            <label className="filter-option">
                                <input
                                    type="checkbox"
                                    checked={statusFilters.upcoming}
                                    onChange={() => handleStatusChange('upcoming')}
                                />
                                Sắp diễn ra
                            </label>
                            <label className="filter-option">
                                <input
                                    type="checkbox"
                                    checked={statusFilters.ongoing}
                                    onChange={() => handleStatusChange('ongoing')}
                                />
                                Đang diễn ra
                            </label>
                            <label className="filter-option">
                                <input
                                    type="checkbox"
                                    checked={statusFilters.ended}
                                    onChange={() => handleStatusChange('ended')}
                                />
                                Đã kết thúc
                            </label>
                        </div>
                    </div>
                    <div className="filter-section">
                        <h3>Hình thức đấu giá</h3>
                        <div className="filter-options">
                            <label className="filter-option">
                                <input
                                    type="checkbox"
                                    checked={auctionTypeFilters.all}
                                    onChange={() => handleAuctionTypeChange('all')}
                                />
                                Tất cả
                            </label>
                            <label className="filter-option">
                                <input
                                    type="checkbox"
                                    checked={auctionTypeFilters.public}
                                    onChange={() => handleAuctionTypeChange('public')}
                                />
                                Đấu giá tài sản công
                            </label>
                            <label className="filter-option">
                                <input
                                    type="checkbox"
                                    checked={auctionTypeFilters.voluntary}
                                    onChange={() => handleAuctionTypeChange('voluntary')}
                                />
                                Đấu giá tự nguyện
                            </label>
                        </div>
                    </div>
                </div>
                <div className="content-area">
                    <div className="content-header">
                        <div className="view-options">
                            <select className="view-toggle">
                                <option>Mới → Cũ</option>
                                <option>Cũ → Mới</option>
                            </select>
                        </div>
                    </div>
                    <div className="auction-grid">
                        {currentAuctions.length > 0 ? (
                            currentAuctions.map((auction) => (
                                <div key={auction.id} className="auction-card">
                                    <div className="auction-image-container">
                                        <img src={auction.image} alt={auction.title} className="auction-image" />
                                        <CountdownTimer auctionId={auction.id} status={auction.status} />
                                        <div className={`status-badge ${getStatusClass(auction.status)}`}>
                                            {getStatusText(auction.status)}
                                        </div>
                                    </div>
                                    <div className="auction-content">
                                        <p className="auction-title">{auction.title}</p>
                                        <div className="auction-details">
                                            <div className="auction-status-text">
                                                Trạng thái:{' '}
                                                <span
                                                    className={`status-text ${
                                                        auction.status === 'Đã kết thúc'
                                                            ? 'ended'
                                                            : auction.status === 'Đang diễn ra'
                                                                ? 'ongoing'
                                                                : 'upcoming'
                                                    }`}
                                                >
                                                    {auction.status}
                                                </span>
                                            </div>
                                            <div className="auction-time">
                                                <strong>Thời gian mở:</strong> {auction.openTime}
                                            </div>
                                            <div className="auction-time">
                                                <strong>Thời gian đóng:</strong> {auction.closeTime}
                                            </div>
                                        </div>
                                        <button
                                            className="detail-btn"
                                            onClick={() => handleDetailClick(auction.id)}
                                        >
                                            Chi Tiết
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Không có sản phẩm nào để hiển thị.</p>
                        )}
                    </div>
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="pagination-btn"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Trước
                            </button>
                            {generatePageNumbers().map((page, index) => (
                                <button
                                    key={index}
                                    className={`pagination-btn ${page === currentPage ? 'active' : ''} ${
                                        page === '...' ? 'dots' : ''
                                    }`}
                                    onClick={() => page !== '...' && setCurrentPage(page)}
                                    disabled={page === '...'}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                className="pagination-btn"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Tiếp
                            </button>
                        </div>
                    )}
                    <div className="text-center mt-4">
                        <Link to="/ongoing-auctions" className="view-all-btn">
                            Xem tất cả
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OngoingAuctionsSection;