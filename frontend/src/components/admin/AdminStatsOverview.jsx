// src/components/admin/AdminStatsOverview.jsx
import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/admin';
import '../../styles/AdminStatsOverview.css';

const AdminStatsOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await adminAPI.getSystemSummary();
        setStats(res);
      } catch (err) {
        console.error('Lỗi khi lấy thống kê tổng quan:', err);
        setError('Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="admin-stats-overview"><div className="loading-card"><p>Đang tải...</p></div></div>;
  if (error) return <div className="admin-stats-overview"><div className="error-card"><p>❌ {error}</p></div></div>;
  if (!stats) return <div className="admin-stats-overview"><div className="no-data"><p>Không có dữ liệu</p></div></div>;

  return (
      <div className="admin-stats-overview">
        <div className="stat-card">
          <span className="stat-icon">👥</span>
          <div className="stat-title">Tổng người dùng</div>
          <div className="stat-value">{stats.totalUsers || 0}</div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📅</span>
          <div className="stat-title">Tổng phiên đấu giá</div>
          <div className="stat-value">{stats.totalSessions || 0}</div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🏠</span>
          <div className="stat-title">Tổng tài sản</div>
          <div className="stat-value">{stats.totalAssets || 0}</div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">💰</span>
          <div className="stat-title">Doanh thu</div>
          <div className="stat-value">{(stats.totalRevenue || 0).toLocaleString()} đ</div>
        </div>
      </div>
  );
};

export default AdminStatsOverview;