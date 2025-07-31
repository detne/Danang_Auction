import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/admin';
import '../../styles/UserStatsTable.css';

const UserStatsTable = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await adminAPI.getUserStatstats();
        setData(result); // vì result là object
      } catch (err) {
        console.error('Lỗi khi tải thống kê người dùng:', err);
        setError('Không thể tải dữ liệu');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Role và status mapping để hiển thị đẹp hơn
  const roleMapping = {
    'BIDDER': { label: 'Người đấu giá', icon: '🏷️', color: '#3b82f6' },
    'ADMIN': { label: 'Quản trị viên', icon: '👨‍💼', color: '#ef4444' },
    'ORGANIZER': { label: 'Tổ chức viên', icon: '📋', color: '#10b981' }
  };

  const statusMapping = {
    'ACTIVE': { label: 'Hoạt động', icon: '✅', color: '#10b981' },
    'INACTIVE': { label: 'Không hoạt động', icon: '❌', color: '#ef4444' },
    'PENDING': { label: 'Chờ duyệt', icon: '⏳', color: '#f59e0b' }
  };

  if (loading) {
    return (
      <div className="stats-container">
        <div className="loading-card">
          <div className="loading-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stats-container">
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const totalUsers = Object.values(data?.byRole || {}).reduce((sum, count) => sum + count, 0);

  return (
    <div className="stats-container">
      {/* Header với tổng quan */}
      <div className="stats-header">
        <div className="header-content">
          <div className="header-icon">👥</div>
          <div>
            <h2>Thống kê người dùng</h2>
            <p className="subtitle">Tổng số người dùng: <span className="total-count">{totalUsers}</span></p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {/* Thống kê theo vai trò */}
        <div className="stats-section">
          <h3 className="section-title">
            <span className="section-icon">🎭</span>
            Phân loại theo vai trò
          </h3>
          <div className="stats-cards">
            {data?.byRole && Object.entries(data.byRole).map(([role, count]) => {
              const roleInfo = roleMapping[role] || { label: role, icon: '👤', color: '#6b7280' };
              return (
                <div key={role} className="stat-card" style={{'--accent-color': roleInfo.color}}>
                  <div className="card-icon">{roleInfo.icon}</div>
                  <div className="card-content">
                    <div className="card-label">{roleInfo.label}</div>
                    <div className="card-value">{count}</div>
                  </div>
                  <div className="card-accent"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Thống kê theo trạng thái */}
        <div className="stats-section">
          <h3 className="section-title">
            <span className="section-icon">📊</span>
            Phân loại theo trạng thái
          </h3>
          <div className="stats-cards">
            {data?.byStatus && Object.entries(data.byStatus).map(([status, count]) => {
              const statusInfo = statusMapping[status] || { label: status, icon: '❓', color: '#6b7280' };
              return (
                <div key={status} className="stat-card" style={{'--accent-color': statusInfo.color}}>
                  <div className="card-icon">{statusInfo.icon}</div>
                  <div className="card-content">
                    <div className="card-label">{statusInfo.label}</div>
                    <div className="card-value">{count}</div>
                  </div>
                  <div className="card-accent"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStatsTable;