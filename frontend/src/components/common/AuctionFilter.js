// src/components/common/AuctionFilter.jsx
import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/AuctionFilter.css'; // nếu cần tách CSS riêng

const AuctionFilter = ({
    searchKeyword,
    setSearchKeyword,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    statusFilters,
    handleStatusChange,
    auctionTypeFilters,
    handleAuctionTypeChange,
    onFilterClick
}) => {
    return (
        <>
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
                <button className="filter-btn" onClick={onFilterClick}>LỌC</button>
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
        </>
    );
};

AuctionFilter.propTypes = {
    searchKeyword: PropTypes.string.isRequired,
    setSearchKeyword: PropTypes.func.isRequired,
    fromDate: PropTypes.string.isRequired,
    setFromDate: PropTypes.func.isRequired,
    toDate: PropTypes.string.isRequired,
    setToDate: PropTypes.func.isRequired,
    statusFilters: PropTypes.object.isRequired,
    handleStatusChange: PropTypes.func.isRequired,
    auctionTypeFilters: PropTypes.object.isRequired,
    handleAuctionTypeChange: PropTypes.func.isRequired,
    onFilterClick: PropTypes.func.isRequired
};

export default AuctionFilter;
