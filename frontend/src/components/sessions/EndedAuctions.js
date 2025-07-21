import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useEndedAuctions from '../../hooks/homepage/useEndedAuctions';
import CountdownTimer from '../common/CountdownTimer';
import AuctionFilter from '../common/AuctionFilter';
import '../../styles/OngoingAuctionsSection.css';
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
        voluntary: false, // Changed from 'private' to 'voluntary'
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
            setAuctionTypeFilters({ all: true, public: false, voluntary: false }); // Updated
        } else {
            setAuctionTypeFilters(prev => ({
                ...prev,
                all: false,
                [type]: !prev[type],
            }));
        }
    };

    const { auctions: auctionData, loading, error } = useEndedAuctions();
    console.log('DEBUG auctionData:', auctionData);

    const handleFilter = () => {
        setCurrentPage(1);
    };

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
                (auctionTypeFilters.voluntary && auction.type === AUCTION_TYPE.VOLUNTARY); // Updated
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
            case AUCTION_STATUS.ENDED: return 'badge-ended';
            case AUCTION_STATUS.ONGOING: return 'badge-ongoing';
            case AUCTION_STATUS.UPCOMING: return 'badge-upcoming';
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

    const handleDetailClick = (id) => {
        navigate(`/sessions/${id}`);
    };

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;

    return (
        <section className="ongoing-auctions-section">
            <div className="page-header">
                <div className="header-content">
                    <h1 className="section-title">Danh sách Cuộc đấu giá đã kết thúc</h1>
                    <div className="breadcrumb">
                        <Link to="/">Trang chủ</Link>
                        <span className="breadcrumb-separator">/</span>
                        <span>Cuộc đấu giá đã kết thúc</span>
                    </div>
                </div>
            </div>

            <div className="main-content">
                <div className="sidebar">
                    <AuctionFilter
                        searchKeyword={searchKeyword}
                        setSearchKeyword={setSearchKeyword}
                        fromDate={fromDate}
                        setFromDate={setFromDate}
                        toDate={toDate}
                        setToDate={setToDate}
                        statusFilters={statusFilters}
                        handleStatusChange={handleStatusChange}
                        auctionTypeFilters={auctionTypeFilters}
                        handleAuctionTypeChange={handleAuctionTypeChange}
                        onFilterClick={handleFilter}
                    />
                </div>

                <div className="content-area">
                    <div className="auction-grid">
                        {currentAuctions.length > 0 ? currentAuctions.map((auction) => (
                            <div key={auction.id} className="auction-card">
                                <div className="auction-image-container">
                                    <img src={auction.image} alt={auction.title} className="auction-image" />
                                    <CountdownTimer status={auction.status} />
                                    <div className={`status-badge ${getStatusClass(auction.status)}`}>
                                        {getStatusText(auction.status)}
                                    </div>
                                </div>
                                <div className="auction-content">
                                    <p className="auction-title">{auction.title}</p>
                                    <div className="auction-details">
                                        <div className="auction-status-text">
                                            Trạng thái: <span className={`status-text ${auction.status}`}>{auction.status}</span>
                                        </div>
                                        <div className="auction-time">
                                            <strong>Thời gian mở:</strong> {auction.openTime}
                                        </div>
                                        <div className="auction-time">
                                            <strong>Thời gian đóng:</strong> {auction.closeTime}
                                        </div>
                                    </div>
                                    <button className="detail-btn" onClick={() => handleDetailClick(auction.id)}>
                                        Chi Tiết
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <p>Không có sản phẩm nào để hiển thị.</p>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="pagination-btn"
                                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Trước
                            </button>
                            {generatePageNumbers().map((page, i) => (
                                <button
                                    key={i}
                                    className={`pagination-btn ${page === currentPage ? 'active' : ''} ${page === '...' ? 'dots' : ''}`}
                                    disabled={page === '...'}
                                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                className="pagination-btn"
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