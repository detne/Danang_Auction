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

  if (loading) return <div className="card"><p>Đang tải...</p></div>;
  if (error) return <div className="card"><p>❌ {error}</p></div>;

  return (
    <div className="card">
      <h2>👥 Thống kê người dùng</h2>
      <table>
        <thead>
          <tr>
            <th>Loại</th>
            <th>Giá trị</th>
            <th>Số lượng</th>
          </tr>
        </thead>
        <tbody>
          {data?.byRole &&
            Object.entries(data.byRole).map(([role, count], i) => (
              <tr key={`role-${i}`}>
                <td>Vai trò</td>
                <td>{role}</td>
                <td>{count}</td>
              </tr>
            ))}
          {data?.byStatus &&
            Object.entries(data.byStatus).map(([status, count], i) => (
              <tr key={`status-${i}`}>
                <td>Trạng thái</td>
                <td>{status}</td>
                <td>{count}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserStatsTable;
