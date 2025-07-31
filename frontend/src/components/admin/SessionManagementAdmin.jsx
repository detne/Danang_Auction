// src/components/admin/SessionManagementAdmin.jsx
import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/admin';
import '../../styles/SessionManagementAdmin.css';

const STATUS_LABELS = {
  UPCOMING: "Sắp diễn ra",
  FINISHED: "Đã kết thúc",
  APPROVED: "Đã duyệt",
  ACTIVE: "Đang diễn ra",
  CANCELLED: "Đã huỷ",
  UNKNOWN: "Không xác định"
};

const TYPE_LABELS = {
  PUBLIC: "Công khai",
  PRIVATE: "Riêng tư",
  UNKNOWN: "Không xác định"
};

const SessionManagementAdmin = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await adminAPI.getAuctionSessionStats();
        setStats(res.data || res);
      } catch (err) {
        setError('Không thể tải thống kê phiên đấu giá');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
      <div className="session-management-admin">
        <div className="loading-spinner">Đang tải thống kê...</div>
      </div>
  );
  if (error) return (
      <div className="session-management-admin">
        <div className="no-data">{error}</div>
      </div>
  );
  if (!stats) return null;

  return (
      <div className="session-management-admin">
        <div className="stats-header">
          <h2>
            <span className="header-icon"></span>
            Thống kê phiên đấu giá
          </h2>
        </div>
        <div className="stats-grid">
          {/* Theo trạng thái */}
          <div className="stats-section">
            <h3 className="section-title">
              <span className="section-icon">📊</span>
              Theo trạng thái
            </h3>
            <div>
              <table className="stats-table">
                <thead>
                <tr>
                  <th>Trạng thái</th>
                  <th>Số lượng</th>
                </tr>
                </thead>
                <tbody>
                {Object.entries(stats.byStatus).map(([key, value]) => (
                    <tr key={key}>
                      <td>{STATUS_LABELS[key] || key}</td>
                      <td><b>{value}</b></td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Theo loại */}
          <div className="stats-section">
            <h3 className="section-title">
              <span className="section-icon">📂</span>
              Theo loại
            </h3>
            <div>
              <table className="stats-table">
                <thead>
                <tr>
                  <th>Loại</th>
                  <th>Số lượng</th>
                </tr>
                </thead>
                <tbody>
                {Object.entries(stats.byType).map(([key, value]) => (
                    <tr key={key}>
                      <td>{TYPE_LABELS[key] || key}</td>
                      <td><b>{value}</b></td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  );
};

export default SessionManagementAdmin;