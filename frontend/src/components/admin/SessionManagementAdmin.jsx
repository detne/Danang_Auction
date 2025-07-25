import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/admin';
import { assetAPI } from '../../services/asset';
import { formatDate } from '../../utils/formatDate';
import '../../styles/SessionManagementAdmin.css';

const SessionManagementAdmin = () => {
  const [sessions, setSessions] = useState([]);
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Danh sách tài sản
  const [assets, setAssets] = useState([]);
  const [loadingAssets, setLoadingAssets] = useState(true);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminAPI.getAdminSessions(status, q);
      setSessions(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error('Lỗi khi tải phiên đấu giá:', err);
      setError('Không thể tải dữ liệu');
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [status]);

  // Fetch tài sản khi mount
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoadingAssets(true);
        const res = await assetAPI.getAllAssets();
        setAssets(Array.isArray(res) ? res : (res.data || []));
      } catch (err) {
        setAssets([]);
      } finally {
        setLoadingAssets(false);
      }
    };
    fetchAssets();
  }, []);

  return (
      <div className="card">
        <h2>⏱️ Quản lý phiên đấu giá</h2>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Tất cả</option>
            <option value="UPCOMING">Sắp diễn ra</option>
            <option value="ACTIVE">Đang diễn ra</option>
            <option value="ENDED">Kết thúc</option>
          </select>
          <input
              placeholder="Tìm theo tên tài sản"
              value={q}
              onChange={(e) => setQ(e.target.value)}
          />
          <button onClick={fetchSessions} disabled={loading}>
            🔍 {loading ? 'Đang tải...' : 'Lọc'}
          </button>
        </div>

        {error && <p style={{ color: 'red' }}>❌ {error}</p>}
        {loadingAssets && <p>Đang tải danh sách tài sản...</p>}

        {sessions.length > 0 ? (
            <table>
              <thead>
              <tr>
                <th>ID</th>
                <th>Tên tài sản</th>
                <th>Thời gian bắt đầu</th>
                <th>Trạng thái</th>
              </tr>
              </thead>
              <tbody>
              {sessions.map((s) => {
                // Lấy asset phù hợp theo id
                const asset = assets.find(
                    (a) => a.id === s.asset_id || a.id === s.assetId
                );
                // Lấy trường thời gian đầu tiên có giá trị
                const sessionStart =
                    s.startTime ||
                    s.start_time ||
                    s.startAt ||
                    s.start_at ||
                    s.start_date ||
                    s.startdate ||
                    s.time_start ||
                    null;

                return (
                    <tr key={s.id}>
                      <td>{s.id || 'N/A'}</td>
                      <td>
                        {asset
                            ? (asset.name || asset.description || asset.assetName)
                            : (s.assetName || 'N/A')}
                      </td>
                      <td>{sessionStart ? formatDate(sessionStart) : 'N/A'}</td>
                      <td>{s.status || 'N/A'}</td>
                    </tr>
                );
              })}
              </tbody>
            </table>
        ) : (
            !loading && <p>Không có phiên nào phù hợp</p>
        )}
      </div>
  );
};

export default SessionManagementAdmin;
