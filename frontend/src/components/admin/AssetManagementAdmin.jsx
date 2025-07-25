import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/admin';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import '../../styles/AssetManagementAdmin.css';

const AssetManagementAdmin = () => {
  const [assets, setAssets] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [auctions, setAuctions] = useState({}); // auctions[assetId] = []
  const [status, setStatus] = useState('PENDING_APPROVAL');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingAuctions, setLoadingAuctions] = useState({});
  const [error, setError] = useState(null);

  const fetchAssets = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminAPI.getAssetsByStatusAndKeyword(status, keyword);
      setAssets(Array.isArray(res) ? res : []);
    } catch (err) {
      setError('Không thể tải dữ liệu tài sản');
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuctionsByAsset = async (assetId) => {
    setLoadingAuctions(prev => ({ ...prev, [assetId]: true }));
    try {
      // Giả sử API hỗ trợ filter theo assetId (bạn có thể đổi thành gọi tất cả rồi filter)
      const res = await adminAPI.getAdminSessions('', assetId);
      setAuctions(prev => ({ ...prev, [assetId]: Array.isArray(res) ? res : [] }));
    } catch (err) {
      setAuctions(prev => ({ ...prev, [assetId]: [] }));
    } finally {
      setLoadingAuctions(prev => ({ ...prev, [assetId]: false }));
    }
  };
  const handleReview = (id, action) => {
    // TODO: Call API approve/reject asset
    alert(`Bạn đã chọn ${action === "APPROVE" ? "DUYỆT" : "TỪ CHỐI"} tài sản có ID: ${id}`);
  };

  const handleExpand = (assetId) => {
    setExpanded((prev) => ({
      ...prev,
      [assetId]: !prev[assetId]
    }));
    // Nếu chưa load phiên đấu giá cho asset này thì fetch luôn
    if (!auctions[assetId]) {
      fetchAuctionsByAsset(assetId);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [status]);

  return (
      <div className="card">
        <h2>📦 Quản lý tài sản</h2>
        {/* ...các control filter giữ nguyên... */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
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

        {error && <p style={{ color: 'red' }}>❌ {error}</p>}

        {assets.length > 0 ? (
            <table className="asset-admin-table">
              <thead>
              <tr>
                <th></th>
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
                  <React.Fragment key={a.id}>
                    <tr>
                      <td>
                        <button
                            onClick={() => handleExpand(a.id)}
                            className="btn btn-sm btn-outline-secondary"
                        >
                          {expanded[a.id] ? '−' : '+'}
                        </button>
                      </td>
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
                              <button onClick={() => handleReview(a.id, 'APPROVE')} style={{ marginRight: 8 }}>
                                ✅
                              </button>
                              <button onClick={() => handleReview(a.id, 'REJECT')}>
                                ❌
                              </button>
                            </>
                        )}
                      </td>
                    </tr>
                    {/* Hiển thị table con nếu expand */}
                    {expanded[a.id] && (
                        <tr>
                          <td colSpan={9}>
                            <div className="auctions-sub-table">
                              {loadingAuctions[a.id] ? (
                                  <div>Đang tải phiên đấu giá...</div>
                              ) : auctions[a.id]?.length > 0 ? (
                                  <table>
                                    <thead>
                                    <tr>
                                      <th>Mã phiên</th>
                                      <th>Trạng thái</th>
                                      <th>Bắt đầu</th>
                                      <th>Kết thúc</th>
                                      <th>Giá khởi điểm</th>
                                      <th>Hành động</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {auctions[a.id].map(session => (
                                        <tr key={session.id}>
                                          <td>{session.session_code || session.code}</td>
                                          <td>{session.status}</td>
                                          <td>{session.start_time ? formatDate(session.start_time) : 'N/A'}</td>
                                          <td>{session.end_time ? formatDate(session.end_time) : 'N/A'}</td>
                                          <td>{session.starting_price ? formatCurrency(session.starting_price) : 'N/A'}</td>
                                          <td>
                                            {/* Thêm action nếu cần, ví dụ: */}
                                            <button className="btn btn-sm btn-info">Xem chi tiết</button>
                                          </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                  </table>
                              ) : (
                                  <div>Chưa có phiên đấu giá nào cho tài sản này.</div>
                              )}
                            </div>
                          </td>
                        </tr>
                    )}
                  </React.Fragment>
              ))}
              </tbody>
            </table>
        ) : (
            !loading && <p>Không có tài sản phù hợp</p>
        )}
      </div>
  );
};

export default AssetManagementAdmin;
