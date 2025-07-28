import React, { useEffect, useState } from 'react';
import { walletAPI } from '../../services/wallet';
import { useUser } from '../../contexts/UserContext';
import { Table, Spinner, Alert } from 'react-bootstrap';

const DepositHistory = () => {
  const { token } = useUser();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    walletAPI.getMyPayments(token)
      .then(res => {
        setPayments(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Không thể tải dữ liệu nạp tiền');
        setLoading(false);
      });
  }, [token]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (payments.length === 0) return <Alert variant="info">Bạn chưa có giao dịch nào.</Alert>;

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>STT</th>
          <th>Số tiền</th>
          <th>Thời gian</th>
          <th>Trạng thái</th>
        </tr>
      </thead>
      <tbody>
        {payments.map((p, index) => (
          <tr key={p.id}>
            <td>{index + 1}</td>
            <td>{p.amount.toLocaleString('vi-VN')} đ</td>
            <td>{new Date(p.createdAt).toLocaleString()}</td>
            <td>
              <span style={{ color: p.status === 'COMPLETED' ? 'green' : 'orange' }}>
                {p.status === 'COMPLETED' ? '✅ Thành công' : '⏳ Đang xử lý'}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default DepositHistory;
