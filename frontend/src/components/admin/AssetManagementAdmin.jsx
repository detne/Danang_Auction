import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/admin';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import '../../styles/AssetManagementAdmin.css';

const AssetManagementAdmin = () => {
  const [assets, setAssets] = useState([]);
  const [status, setStatus] = useState('PENDING_APPROVAL');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // NEW: Thống kê tổng quan toàn bộ tài sản
  const [statsData, setStatsData] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  // Lấy thống kê từ toàn bộ danh sách asset (từ backend hoặc filter lại toàn bộ)
  const fetchStats = async () => {
    try {
      // Nếu backend có API riêng, gọi API thống kê ở đây thay vì getAssetsByStatusAndKeyword('ALL', '')
      const allAssets = await adminAPI.getAssetsByStatusAndKeyword('ALL', '');
      setStatsData({
        total: allAssets.length,
        pending: allAssets.filter(a => a.status === 'PENDING_APPROVAL').length,
        approved: allAssets.filter(a => a.status === 'APPROVED').length,
        rejected: allAssets.filter(a => a.status === 'REJECTED').length,
      });
    } catch {
      setStatsData({
        total: 0, pending: 0, approved: 0, rejected: 0
      });
    }
  };

  // Lấy danh sách asset theo filter hiện tại
  const fetchAssets = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminAPI.getAssetsByStatusAndKeyword(status, keyword);
      setAssets(Array.isArray(res) ? res : []);
    } catch (err) {
      setError('Không thể tải dữ liệu tài sản. Vui lòng thử lại.');
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  // Gọi lại stats khi lần đầu và khi duyệt/xoá asset
  useEffect(() => {
    fetchStats();
  }, []);

  // Khi thay đổi trạng thái/từ khoá thì chỉ load danh sách asset
  useEffect(() => {
    fetchAssets();
  }, [status]);

  const handleReview = async (id, action) => {
    const reason =
      action === 'REJECT' ? prompt('Nhập lý do từ chối:') : 'Tài sản hợp lệ';
    if (action === 'REJECT' && (!reason || reason.trim() === '')) return;
    try {
      const token = localStorage.getItem('token');
      console.log('Review asset:', id, action, reason, token);
      const res = await adminAPI.reviewAsset(id, { action, reason }, token);
      // await adminAPI.reviewAsset(id, { action, reason }, token);
      alert(`${action === 'APPROVE' ? '✅ Đã duyệt' : '❌ Đã từ chối'} tài sản thành công`);
      fetchAssets(); // reload danh sách sau khi duyệt/xoá
      fetchStats();  // reload số liệu thống kê
      console.log('Review asset response:', res);
    } catch (err) {
      alert('⚠️ Có lỗi xảy ra khi xử lý tài sản. Vui lòng thử lại.');
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'PENDING_CREATE': {
        class: 'status-pending-create',
        text: 'Chờ tạo',
        icon: '⏳'
      },
      'PENDING_APPROVAL': {
        class: 'status-pending-approval',
        text: 'Chờ duyệt',
        icon: '📋'
      },
      'APPROVED': {
        class: 'status-approved',
        text: 'Đã duyệt',
        icon: '✅'
      },
      'REJECTED': {
        class: 'status-rejected',
        text: 'Bị từ chối',
        icon: '❌'
      }
    };
    const statusInfo = statusMap[status] || {
      class: 'status-pending-approval',
      text: status,
      icon: '❓'
    };
    return (
      <span className={`status-badge ${statusInfo.class}`}>
        {statusInfo.icon} {statusInfo.text}
      </span>
    );
  };

  return (
    <div className="asset-management-admin">
      <div className="main-container" style={{ position: 'relative' }}>
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <div className="loading-text">Đang tải dữ liệu...</div>
          </div>
        )}

        {/* Filter Section */}
        <div className="filter-section">
          <div className="filter-group">
            <label className="filter-label">Trạng thái</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="PENDING_CREATE">⏳ Chờ tạo</option>
              <option value="PENDING_APPROVAL">📋 Chờ duyệt</option>
              <option value="APPROVED">✅ Đã duyệt</option>
              <option value="REJECTED">❌ Bị từ chối</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Tìm kiếm</label>
            <input
              placeholder="Nhập mô tả tài sản để tìm kiếm..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && fetchAssets()}
            />
          </div>

          <button
            className="btn-filter"
            onClick={fetchAssets}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="loading-spinner" style={{ width: '16px', height: '16px', margin: 0, marginBottom: 0 }}></div>
                Đang tải...
              </>
            ) : (
              <>
                🔍 Tìm kiếm
              </>
            )}
          </button>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stat-item">
            <span>📊 Tổng số:</span>
            <span className="stat-number">{statsData.total}</span>
          </div>
          <div className="stat-item">
            <span>📋 Chờ duyệt:</span>
            <span className="stat-number">{statsData.pending}</span>
          </div>
          <div className="stat-item">
            <span>✅ Đã duyệt:</span>
            <span className="stat-number">{statsData.approved}</span>
          </div>
          <div className="stat-item">
            <span>❌ Từ chối:</span>
            <span className="stat-number">{statsData.rejected}</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {/* Table Section */}
        {assets.length > 0 ? (
          <div className="table-container">
            <table className="asset-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Mã tài sản</th>
                  <th>Mô tả tài sản</th>
                  <th>Giá khởi điểm</th>
                  <th>Trạng thái</th>
                  <th>Thời gian bắt đầu</th>
                  <th>Thời gian kết thúc</th>
                  <th style={{ textAlign: 'center' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset.id}>
                    <td data-label="ID">
                      <span className="asset-id">#{asset.id || 'N/A'}</span>
                    </td>
                    <td data-label="Mã tài sản">
                      <span className="asset-code">
                        {asset.document_code || 'Chưa có mã'}
                      </span>
                    </td>
                    <td data-label="Mô tả" className="asset-description">
                      {asset.description || 'Không có mô tả'}
                    </td>
                    <td data-label="Giá khởi điểm">
                      <span className="asset-price">
                        {asset.starting_price ? formatCurrency(asset.starting_price) : 'Chưa định giá'}
                      </span>
                    </td>
                    <td data-label="Trạng thái">
                      {getStatusBadge(asset.status)}
                    </td>
                    <td data-label="Bắt đầu">
                      <span className="asset-date">
                        {asset.start_time ? formatDate(asset.start_time) : 'Chưa xác định'}
                      </span>
                    </td>
                    <td data-label="Kết thúc">
                      <span className="asset-date">
                        {asset.end_time ? formatDate(asset.end_time) : 'Chưa xác định'}
                      </span>
                    </td>
                    <td data-label="Hành động">
                      {asset.status === 'PENDING_APPROVAL' ? (
                        <div className="action-buttons">
                          <button
                            className="btn-approve"
                            onClick={() => handleReview(asset.id, 'APPROVE')}
                            title="Duyệt tài sản này"
                          >
                            ✅ Duyệt
                          </button>
                          <button
                            className="btn-reject"
                            onClick={() => handleReview(asset.id, 'REJECT')}
                            title="Từ chối tài sản này"
                          >
                            ❌ Từ chối
                          </button>
                        </div>
                      ) : (
                        <span className="text-muted" style={{ fontSize: '12px' }}>
                          Không có hành động
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && (
            <div className="empty-state">
              <div className="empty-state-icon">📦</div>
              <div className="empty-state-text">Không tìm thấy tài sản</div>
              <div className="empty-state-subtext">
                Không có tài sản nào phù hợp với bộ lọc hiện tại
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AssetManagementAdmin;
