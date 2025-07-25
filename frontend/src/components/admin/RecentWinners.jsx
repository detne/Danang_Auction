import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/admin';
import '../../styles/RecentWinners.css';

const RecentWinners = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWinners = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await adminAPI.getRecentWinners();
        console.log('DEBUG-winners-result:', result);
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

  if (loading) return <div className="recent-winners"><p>Đang tải...</p></div>;
  if (error) return <div className="recent-winners"><p>❌ {error}</p></div>;
  if (!winners || winners.length === 0)
    return (
        <div className="recent-winners">
          <div className="recent-winners__title">
            <span className="recent-winners__icon">🏆</span>
            Người thắng cuộc gần nhất
          </div>
          <div style={{ padding: 16, color: "#aaa" }}>Không có dữ liệu người thắng!</div>
        </div>
    );

  return (
      <div className="recent-winners">
        <div className="recent-winners__title">
          <span className="recent-winners__icon">🏆</span>
          Người thắng cuộc gần nhất
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="recent-winners__table">
            <thead>
            <tr>
              <th>STT</th>
              <th>Tên phiên</th>
              <th>Người thắng</th>
              <th>Tên đăng nhập</th>
              <th>Số tiền thắng</th>
              <th>Thời gian thắng</th>
            </tr>
            </thead>
            <tbody>
            {winners.map((w, idx) => (
                <tr key={w.sessionId}>
                  <td>{idx + 1}</td>
                  <td>{w.sessionTitle}</td>
                  <td>{w.winnerName}</td>
                  <td>{w.winnerUsername}</td>
                  <td>
                    {w.winAmount !== undefined && w.winAmount !== null
                        ? Number(w.winAmount).toLocaleString('vi-VN') + ' ₫'
                        : 'N/A'}
                  </td>
                  <td>
                    {w.winTime
                        ? new Date(w.winTime).toLocaleString('vi-VN', {
                          hour12: false,
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                        : 'N/A'}
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default RecentWinners;
