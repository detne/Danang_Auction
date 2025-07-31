import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useEndedAuctions from '../../hooks/homepage/useEndedAuctions';
import CountdownTimer from '../common/CountdownTimer';
import '../../styles/EndedAuctions.css';
import { AUCTION_TYPE, AUCTION_STATUS } from '../../utils/constants';

const EndedAuctions = () => {
    const navigate = useNavigate();
    const [searchKeyword, setSearchKeyword] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);

    const [statusFilters, setStatusFilters] = useState({
        all: true,
        upcoming: false,
        ongoing: false,
        ended: true,
    });

    const [auctionTypeFilters, setAuctionTypeFilters] = useState({
        all: true,
        public: false,
        voluntary: false,
    });

    const handleStatusChange = (type) => {
        if (type === 'all') {
            setStatusFilters({ all: true, upcoming: false, ongoing: false, ended: false });
        } else {
            setStatusFilters(prev => ({
                ...prev,
                all: false,
                [type]: !prev[type],
            }));
        }
    };

    const handleAuctionTypeChange = (type) => {
        if (type === 'all') {
            setAuctionTypeFilters({ all: true, public: false, voluntary: false });
        } else {
            setAuctionTypeFilters(prev => ({
                ...prev,
                all: false,
                [type]: !prev[type],
            }));
        }
    };

    const { auctions: auctionData, loading, error } = useEndedAuctions();

    const handleFilter = () => setCurrentPage(1);

    const filteredAuctions = auctionData.filter(auction => {
        if (!statusFilters.all) {
            const match =
                (statusFilters.upcoming && auction.status === AUCTION_STATUS.UPCOMING) ||
                (statusFilters.ongoing && auction.status === AUCTION_STATUS.ONGOING) ||
                (statusFilters.ended && auction.status === AUCTION_STATUS.ENDED);
            if (!match) return false;
        }

        if (!auctionTypeFilters.all) {
            const match =
                (auctionTypeFilters.public && auction.type === AUCTION_TYPE.PUBLIC) ||
                (auctionTypeFilters.voluntary && auction.type === AUCTION_TYPE.VOLUNTARY);
            if (!match) return false;
        }

        if (searchKeyword && !auction.title?.toLowerCase().includes(searchKeyword.toLowerCase())) {
            return false;
        }
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

    const getStatusClass = (status) => {
        switch (status) {
            case AUCTION_STATUS.ENDED: return 'auctions-badge-ended';
            case AUCTION_STATUS.ONGOING: return 'auctions-badge-ongoing';
            case AUCTION_STATUS.UPCOMING: return 'auctions-badge-upcoming';
            default: return '';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case AUCTION_STATUS.ENDED: return 'Phiên đã kết thúc';
            case AUCTION_STATUS.ONGOING: return 'Đang diễn ra';
            case AUCTION_STATUS.UPCOMING: return 'Sắp diễn ra';
            default: return 'Không xác định';
        }
    };

    const handleDetailClick = (id) => navigate(`/sessions/${id}`);

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;

    return (
        <section className="auctions-section">
            <div className="auctions-header">
                <div className="auctions-header-content">
                    <h1 className="auctions-title">Danh sách Cuộc đấu giá đã kết thúc</h1>
                    <div className="auctions-breadcrumb">
                        <Link to="/">Trang chủ</Link>
                        <span className="auctions-breadcrumb-separator">/</span>
                        <span>Cuộc đấu giá đã kết thúc</span>
                    </div>
                </div>
            </div>

            <div className="auctions-main-content">
                <div className="auctions-sidebar">
                    <div className="auctions-filter-section">
                        <h3>Tìm kiếm</h3>
                        <input
                            type="text"
                            placeholder="Nhập từ khóa..."
                            className="auctions-search-input"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                        <div className="auctions-date-range">
                            <label>Từ ngày</label>
                            <input
                                type="date"
                                className="auctions-date-input"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                            <label>Đến ngày</label>
                            <input
                                type="date"
                                className="auctions-date-input"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />
                        </div>
                        <button className="auctions-filter-btn" onClick={handleFilter}>LỌC</button>
                    </div>

                    <div className="auctions-filter-section">
                        <h3>Trạng thái tài sản</h3>
                        <div className="auctions-filter-options">
                            <label className="auctions-filter-option">
                                <input
                                    type="checkbox"
                                    checked={statusFilters.all}
                                    onChange={() => handleStatusChange('all')}
                                />
                                Tất cả
                            </label>
                            <label className="auctions-filter-option">
                                <input
                                    type="checkbox"
                                    checked={statusFilters.upcoming}
                                    onChange={() => handleStatusChange('upcoming')}
                                />
                                Sắp diễn ra
                            </label>
                            <label className="auctions-filter-option">
                                <input
                                    type="checkbox"
                                    checked={statusFilters.ongoing}
                                    onChange={() => handleStatusChange('ongoing')}
                                />
                                Đang diễn ra
                            </label>
                            <label className="auctions-filter-option">
                                <input
                                    type="checkbox"
                                    checked={statusFilters.ended}
                                    onChange={() => handleStatusChange('ended')}
                                />
                                Đã kết thúc
                            </label>
                        </div>
                    </div>

                    <div className="auctions-filter-section">
                        <h3>Hình thức đấu giá</h3>
                        <div className="auctions-filter-options">
                            <label className="auctions-filter-option">
                                <input
                                    type="checkbox"
                                    checked={auctionTypeFilters.all}
                                    onChange={() => handleAuctionTypeChange('all')}
                                />
                                Tất cả
                            </label>
                            <label className="auctions-filter-option">
                                <input
                                    type="checkbox"
                                    checked={auctionTypeFilters.public}
                                    onChange={() => handleAuctionTypeChange(AUCTION_TYPE.PUBLIC)}
                                />
                                Đấu giá tài sản công
                            </label>
                            <label className="auctions-filter-option">
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

                <div className="auctions-content-area">
                    <div className="auctions-grid">
                        {currentAuctions.length > 0 ? currentAuctions.map((auction) => (
                            <div key={auction.id} className="auctions-card">
                                <div className="auctions-image-container">
                                    <img src={auction.image} alt={auction.title} className="auctions-image" />
                                    <CountdownTimer status={auction.status} />
                                    <div className={`auctions-badge ${getStatusClass(auction.status)}`}>
                                        {getStatusText(auction.status)}
                                    </div>
                                </div>
                                <div className="auctions-card-content">
                                    <p className="auctions-card-title">{auction.title}</p>
                                    <div className="auctions-card-details">
                                        <div className="auctions-status-text">
                                            Trạng thái: <span className={`auctions-status-label ${auction.status}`}>{auction.status}</span>
                                        </div>
                                        <div className="auctions-card-time">
                                            <strong>Thời gian mở:</strong> {auction.openTime}
                                        </div>
                                        <div className="auctions-card-time">
                                            <strong>Thời gian đóng:</strong> {auction.closeTime}
                                        </div>
                                    </div>
                                    <button className="auctions-detail-btn" onClick={() => handleDetailClick(auction.id)}>
                                        Chi Tiết
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <p>Không có sản phẩm nào để hiển thị.</p>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="auctions-pagination">
                            <button
                                className="auctions-pagination-btn"
                                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Trước
                            </button>
                            {generatePageNumbers().map((page, i) => (
                                <button
                                    key={i}
                                    className={`auctions-pagination-btn ${page === currentPage ? 'active' : ''} ${page === '...' ? 'dots' : ''}`}
                                    disabled={page === '...'}
                                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                className="auctions-pagination-btn"
                                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
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

export default EndedAuctions;
