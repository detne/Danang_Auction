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

  const fetchAssets = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminAPI.getAssetsByStatusAndKeyword(status, keyword);
      setAssets(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error('❌ Lỗi khi lấy tài sản:', err);
      setError('Không thể tải dữ liệu tài sản');
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id, action) => {
    const reason =
        action === 'REJECT' ? prompt('Nhập lý do từ chối:') : 'Tài sản hợp lệ';
    if (action === 'REJECT' && !reason) return;

    try {
      const token = localStorage.getItem('token');
      await adminAPI.reviewAsset(id, { action, reason }, token);
      alert(`${action === 'APPROVE' ? '✅ Đã duyệt' : '❌ Đã từ chối'} tài sản`);
      fetchAssets();
    } catch (err) {
      alert('⚠️ Lỗi khi duyệt tài sản');
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [status]);

  return (
      <div className="asset-management-admin">
        <div className="header-section">
          <div className="header-icon">📦</div>
          <div>
            <h2>Quản lý tài sản</h2>
            <p>Tổng số tài sản: {assets.length}</p>
          </div>
        </div>
        <div className="tab-section">
          <button className="tab-button">Thống kê</button>
          <button className={status === 'PENDING_APPROVAL' ? 'tab-button active' : 'tab-button'}>Chờ duyệt</button>
          <button
              className={status === 'APPROVE' ? 'tab-button active approve' : 'tab-button approve'}
              onClick={() => setStatus('APPROVE')}
          >
            Đã duyệt
          </button>
          <button
              className={status === 'REJECTED' ? 'tab-button active reject' : 'tab-button reject'}
              onClick={() => setStatus('REJECTED')}
          >
            Bị từ chối
          </button>
        </div>
        <div className="filter-section">
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="PENDING_CREATE">Chờ tạo</option>
            <option value="PENDING_APPROVAL">Chờ duyệt</option>
            <option value="APPROVED">Đã duyệt</option>
            <option value="REJECTED">Bị từ chối</option>
          </select>
          <input
              placeholder="Tìm mô tả..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
          />
          <button onClick={fetchAssets} disabled={loading}>
            🔍 {loading ? 'Đang tải...' : 'Lọc'}
          </button>
        </div>
        {error && <p className="error-message">❌ {error}</p>}
        {assets.length > 0 ? (
            <table className="asset-table">
              <thead>
              <tr>
                <th>ID</th>
                <th>Mã tài sản</th>
                <th>Mô tả</th>
                <th>Giá khởi điểm</th>
                <th>Trạng thái</th>
                <th>Bắt đầu</th>
                <th>Kết thúc</th>
                <th>Hành động</th>
              </tr>
              </thead>
              <tbody>
              {assets.map((a) => (
                  <tr key={a.id}>
                    <td>{a.id || 'N/A'}</td>
                    <td>{a.document_code || 'N/A'}</td>
                    <td>{a.description || 'N/A'}</td>
                    <td>{a.starting_price ? formatCurrency(a.starting_price) : 'N/A'}</td>
                    <td>{a.status || 'N/A'}</td>
                    <td>{a.start_time ? formatDate(a.start_time) : 'N/A'}</td>
                    <td>{a.end_time ? formatDate(a.end_time) : 'N/A'}</td>
                    <td>
                      {a.status === 'PENDING_APPROVAL' && (
                          <>
                            <button
                                className="action-button approve"
                                onClick={() => handleReview(a.id, 'APPROVE')}
                            >
                              ✅
                            </button>
                            <button
                                className="action-button reject"
                                onClick={() => handleReview(a.id, 'REJECT')}
                            >
                              ❌
                            </button>
                          </>
                      )}
                      {a.status !== 'PENDING_APPROVAL' && (
                          <span className={a.status === 'APPROVED' ? 'status-approved' : 'status-rejected'}>
                      {a.status === 'APPROVED' ? 'Đã duyệt' : 'Bị từ chối'}
                    </span>
                      )}
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
        ) : (
            !loading && <p className="no-data">Không có tài sản phù hợp</p>
        )}
      </div>
  );
};

export default AssetManagementAdmin;