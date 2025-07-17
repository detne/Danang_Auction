import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/OngoingAuctionsSection.css';
import useUpcomingAuctions from '../../hooks/homepage/useUpcomingAuctions';
import { AUCTION_STATUS, AUCTION_TYPE } from '../../utils/constants'

const UpcomingAuctions = () => {
    const navigate = useNavigate();
    const [searchKeyword, setSearchKeyword] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [statusFilters, setStatusFilters] = useState({
        all: true,
        upcoming: true,
        ongoing: false,
        ended: false,
    });
    const [auctionTypeFilters, setAuctionTypeFilters] = useState({
        all: true,
        public: false,
        private: false,
    });
    const [timers, setTimers] = useState({});

    // Use custom hook for fetching upcoming auctions
    const { auctions: auctionData, loading, error } = useUpcomingAuctions();

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

    const filteredAuctions = auctionData.filter(auction => {
        const now = new Date();
        const end = new Date(auction.endDateTime);
    
        // ⚠️ Nếu đã hết thời gian, loại khỏi danh sách
        if (end < now) return false;
    
        // Lọc theo trạng thái
        if (!statusFilters.all) {
            const statusMatch =
                (statusFilters.upcoming && auction.status === AUCTION_STATUS.UPCOMING) ||
                (statusFilters.ongoing && auction.status === AUCTION_STATUS.ONGOING) ||
                (statusFilters.ended && auction.status === AUCTION_STATUS.ENDED);
            if (!statusMatch) return false;
        }
    
        // Lọc theo hình thức đấu giá
        if (!auctionTypeFilters.all) {
            const typeMatch =
                (auctionTypeFilters.public && auction.type === AUCTION_TYPE.PUBLIC) ||
                (auctionTypeFilters.private && auction.type === AUCTION_TYPE.PRIVATE);
            if (!typeMatch) return false;
        }
    
        // Lọc theo từ khóa
        if (searchKeyword && !auction.title?.toLowerCase().includes(searchKeyword.toLowerCase())) {
            return false;
        }
    
        // Lọc theo ngày
        if (fromDate && new Date(auction.openTime) < new Date(fromDate)) return false;
        if (toDate && new Date(auction.closeTime) > new Date(toDate)) return false;
    
        return true;
    });    

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

    useEffect(() => {
        const updateTimers = () => {
            const now = new Date().getTime();
            const newTimers = {};
            auctionData.forEach(auction => {
                if (auction.status === AUCTION_STATUS.ONGOING || auction.status === AUCTION_STATUS.UPCOMING) {
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
            setTimers(newTimers);
        };
    
        const interval = setInterval(updateTimers, 1000);
        updateTimers(); // Gọi 1 lần ban đầu
        return () => clearInterval(interval);
    }, [auctionData]); // ✅ CHỈ phụ thuộc dữ liệu gốc, KHÔNG phải currentAuctions    

    const getStatusClass = (status) => {
        switch (status) {
            case AUCTION_STATUS.ONGOING: return 'status-ongoing';
            case AUCTION_STATUS.UPCOMING: return 'status-upcoming';
            case AUCTION_STATUS.ENDED: return 'status-ended';
            default: return '';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case AUCTION_STATUS.ONGOING: return 'ĐANG DIỄN RA';
            case AUCTION_STATUS.UPCOMING: return 'CHƯA DIỄN RA';
            case AUCTION_STATUS.ENDED: return 'ĐÃ KẾT THÚC';
            default: return status;
        }
    };

    const CountdownTimer = ({ auctionId, status }) => {
        const timer = timers[auctionId];
        if (status === AUCTION_STATUS.ENDED || (timer && timer.expired)) {
            return <div className="ended-overlay">ĐÃ KẾT THÚC</div>;
        }
        if (!timer) return null;
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
            navigate(`/auction/${auctionId}`, { state: { auction } });
        }
    };

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;

    return (
        <section className="ongoing-auctions-section">
            <div className="page-header">
                <div className="header-content">
                    <h1 className="section-title">Danh sách Cuộc đấu giá sắp diễn ra</h1>
                    <div className="breadcrumb">
                        <Link to="/" style={{ textDecoration: 'none' }}>Trang chủ</Link>
                        <span className="breadcrumb-separator">/</span>
                        <span>Cuộc đấu giá sắp diễn ra</span>
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
                                    onChange={() => handleAuctionTypeChange(AUCTION_TYPE.PUBLIC)}
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
                                                        auction.status === AUCTION_STATUS.ENDED
                                                            ? 'ended'
                                                            : auction.status === AUCTION_STATUS.ONGOING
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
                            <div className="no-auctions-message">
                                <p>Không có sản phẩm nào để hiển thị.</p>
                            </div>
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
                </div>
            </div>
        </section>
    );
};

export default UpcomingAuctions;