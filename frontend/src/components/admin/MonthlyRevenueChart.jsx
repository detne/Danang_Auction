// src/components/admin/MonthlyRevenueChart.jsx
import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/admin';
import '../../styles/MonthlyRevenueChart.css';

const MonthlyRevenueChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await adminAPI.getMonthlyRevenue();
        setData(Array.isArray(result) ? result : []);
      } catch (err) {
        console.error('Lỗi khi tải doanh thu theo tháng:', err);
        setError('Không thể tải dữ liệu');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="monthly-revenue-chart"><div className="card"><p>Đang tải...</p></div></div>;
  if (error) return <div className="monthly-revenue-chart"><div className="card"><p>❌ {error}</p></div></div>;

  return (
      <div className="monthly-revenue-chart">
        <div className="card">
          <h2>💰 Doanh thu theo tháng</h2>
          {data.length > 0 ? (
              <ul>
                {data.map((item, i) => (
                    <li key={i}>
                      {item.month || 'N/A'}: {(item.totalRevenue || 0).toLocaleString()} đ
                    </li>
                ))}
              </ul>
          ) : (
              <p>Không có dữ liệu doanh thu</p>
          )}
        </div>
      </div>
  );
};

export default MonthlyRevenueChart;