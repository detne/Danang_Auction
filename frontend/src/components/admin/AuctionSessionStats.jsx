import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/admin';
import '../../styles/AuctionSessionStats.css';

const AuctionSessionStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await adminAPI.getAuctionSessionStats();
        setStats(result); // là object
      } catch (err) {
        console.error('Lỗi khi tải thống kê phiên đấu giá:', err);
        setError('Không thể tải dữ liệu');
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="card"><p>Đang tải...</p></div>;
  if (error) return <div className="card"><p>❌ {error}</p></div>;
  if (!stats) return <div className="card"><p>Không có dữ liệu thống kê</p></div>;

  return (
    <div className="card">
      <h2>🏆 Thống kê phiên đấu giá</h2>
      <h4>Theo Loại Phiên:</h4>
      <ul>
        {Object.entries(stats.byType || {}).map(([type, count]) => (
          <li key={type}>{type}: {count}</li>
        ))}
      </ul>
      <h4>Theo Trạng Thái:</h4>
      <ul>
        {Object.entries(stats.byStatus || {}).map(([status, count]) => (
          <li key={status}>{status}: {count}</li>
        ))}
      </ul>
    </div>
  );
};

export default AuctionSessionStats;