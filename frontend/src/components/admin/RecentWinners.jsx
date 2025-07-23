// src/components/admin/RecentWinners.jsx
import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/admin';
import '../../styles/RecentWinners.css';

const RecentWinners = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await adminAPI.getRecentWinners();
        // Đảm bảo result là mảng
        setWinners(Array.isArray(result) ? result : []);
      } catch (err) {
        console.error('Lỗi khi tải người thắng gần nhất:', err);
        setError('Không thể tải dữ liệu');
        setWinners([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWinners();
  }, []);

  if (loading) return <div className="card"><p>Đang tải...</p></div>;
  if (error) return <div className="card"><p>❌ {error}</p></div>;

  return (
    <div className="card">
      <h2>🥇 Người thắng gần nhất</h2>
      {winners.length > 0 ? (
        <ul>
          {winners.map((w, i) => (
            <li key={i}>
              {w.fullName || 'N/A'} - {w.assetName || 'N/A'} ({(w.bidAmount || 0).toLocaleString()} đ)
            </li>
          ))}
        </ul>
      ) : (
        <p>Không có dữ liệu người thắng</p>
      )}
    </div>
  );
};

export default RecentWinners;
