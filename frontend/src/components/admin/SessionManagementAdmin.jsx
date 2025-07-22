// src/components/admin/SessionManagementAdmin.jsx
import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/admin';
import { formatDate } from '../../utils/formatDate';
import '../../styles/SessionManagementAdmin.css';

const SessionManagementAdmin = () => {
  const [sessions, setSessions] = useState([]);
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminAPI.getAdminSessions(status, q);
      // Đảm bảo res là mảng
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

  return (
    <div className="card">
      <h2>⏱️ Quản lý phiên đấu giá</h2>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Tất cả</option>
          <option value="UPCOMING">Sắp diễn ra</option>
          <option value="ONGOING">Đang diễn ra</option>
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
            {sessions.map((s) => (
              <tr key={s.id}>
                <td>{s.id || 'N/A'}</td>
                <td>{s.assetName || 'N/A'}</td>
                <td>{s.startTime ? formatDate(s.startTime) : 'N/A'}</td>
                <td>{s.status || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>Không có phiên nào phù hợp</p>
      )}
    </div>
  );
};

export default SessionManagementAdmin;