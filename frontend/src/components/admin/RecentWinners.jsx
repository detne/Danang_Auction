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
        setWinners(Array.isArray(result) ? result : []);
      } catch (err) {
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
      <div className="card recent-winners">
        <h2>🥇 Người thắng gần nhất</h2>
        {winners.length > 0 ? (
            <table className="winners-table">
              <thead>
              <tr>
                <th>Họ tên</th>
                <th>Tài sản</th>
                <th>Giá trúng</th>
                <th>Thời gian</th>
              </tr>
              </thead>
              <tbody>
              {winners.map((w, i) => (
                  <tr key={i}>
                    <td>{w.winnerName || w.winnerUsername || 'N/A'}</td>
                    <td>{w.sessionTitle || 'N/A'}</td>
                    <td>{(w.winAmount || 0).toLocaleString('vi-VN')} đ</td>
                    <td>{w.winTime ? new Date(w.winTime).toLocaleString('vi-VN') : ''}</td>
                  </tr>
              ))}
              </tbody>
            </table>
        ) : (
            <p>Không có dữ liệu người thắng</p>
        )}
      </div>
  );
};

export default RecentWinners;
