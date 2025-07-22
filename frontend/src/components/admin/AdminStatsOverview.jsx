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

  if (loading) return <div className="card"><p>Đang tải...</p></div>;
  if (error) return <div className="card"><p>❌ {error}</p></div>;
  if (!stats) return <div className="card"><p>Không có dữ liệu</p></div>;

  return (
    <div className="card">
      <h2>📊 Thống kê hệ thống</h2>
      <ul>
        <li>Tổng người dùng: {stats.totalUsers || 0}</li>
        <li>Tổng phiên đấu giá: {stats.totalSessions || 0}</li>
        <li>Tổng tài sản: {stats.totalAssets || 0}</li>
        <li>Doanh thu: {(stats.totalRevenue || 0).toLocaleString()} đ</li>
      </ul>
    </div>
  );
};

export default AdminStatsOverview;