// src/components/admin/AuctionTable.jsx
import React, {useState, useEffect} from 'react';
import {adminAPI} from '../../services/admin';
import {formatDate} from '../../utils/formatDate';
import {formatCurrency} from '../../utils/formatCurrency';

const AuctionTable = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                setLoading(true);
                const response = await adminAPI.getAuctions();
                if (response.success) {
                    setAuctions(response.data || []);
                } else {
                    setError('Không thể tải danh sách phiên đấu giá');
                }
            } catch (err) {
                setError(err.message || 'Lỗi khi tải phiên đấu giá');
            } finally {
                setLoading(false);
            }
        };

        fetchAuctions();
    }, []);

    const filteredAuctions = auctions.filter(auction => {
        const matchesSearch = auction.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = selectedFilter === 'all' || auction.status === selectedFilter;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="dashboard-content">

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px',
                    gap: '15px',
                    color: '#6c757d'
                }}>
                    <div style={{
                        width: '24px',
                        height: '24px',
                        border: '3px solid #f3f3f3',
                        borderTop: '3px solid #FF6B47',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <span>Đang tải dữ liệu...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-content">
            <div className="page-header">

                <div className="page-actions">
                    <button className="btn-primary">
                        <span>+</span>
                        Tạo phiên đấu giá
                    </button>
                </div>
            </div>

            <div className="table-container">
                <div className="table-header">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Tìm kiếm phiên đấu giá..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="search-btn">🔍</button>
                    </div>
                    <div className="table-filters">
                        <select
                            className="filter-select"
                            value={selectedFilter}
                            onChange={(e) => setSelectedFilter(e.target.value)}
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="UPCOMING">Sắp diễn ra</option>
                            <option value="ONGOING">Đang diễn ra</option>
                            <option value="ENDED">Đã kết thúc</option>
                        </select>
                        <button className="btn-filter">Lọc</button>
                    </div>
                </div>

                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tiêu đề</th>
                            <th>Giá khởi điểm</th>
                            <th>Giá hiện tại</th>
                            <th>Trạng thái</th>
                            <th>Ngày bắt đầu</th>
                            <th>Ngày kết thúc</th>
                            <th>Thao tác</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredAuctions.map(auction => (
                            <tr key={auction.id}>
                                <td>{auction.id}</td>
                                <td>
                                    <div className="auction-title">
                                        <strong>{auction.title || 'N/A'}</strong>
                                    </div>
                                </td>
                                <td className="price">{formatCurrency(auction.startPrice || 0)}</td>
                                <td className="price current">{formatCurrency(auction.currentPrice || auction.startPrice || 0)}</td>
                                <td>
                    <span className={`status ${auction.status?.toLowerCase()}`}>
                      {auction.status === 'UPCOMING' ? 'Sắp diễn ra' :
                          auction.status === 'ONGOING' ? 'Đang diễn ra' :
                              auction.status === 'ENDED' ? 'Đã kết thúc' : 'N/A'}
                    </span>
                                </td>
                                <td>{formatDate(auction.startTime)}</td>
                                <td>{formatDate(auction.endTime)}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="btn-action view" title="Xem chi tiết">👁️</button>
                                        <button className="btn-action edit" title="Chỉnh sửa">✏️</button>
                                        <button className="btn-action delete" title="Xóa">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {filteredAuctions.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon">🏆</div>
                            <h3>Không tìm thấy phiên đấu giá</h3>
                            <p>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuctionTable;