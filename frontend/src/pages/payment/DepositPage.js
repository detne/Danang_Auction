import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Image } from 'react-bootstrap';
import apiClient from '../../services/api';

const DepositPage = () => {
  const [amount, setAmount] = useState('');
  const [channel, setChannel] = useState('BANK'); // ✅ thêm mặc định
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  // Gửi yêu cầu nạp tiền
  const handleDeposit = async (e) => {
    e.preventDefault();
    const parsedAmount = parseInt(amount);

    if (isNaN(parsedAmount) || parsedAmount < 10000) {
      setError('Số tiền không hợp lệ. Vui lòng nhập số tiền >= 10.000 VNĐ.');
      return;
    }

    try {
      const res = await apiClient.post('/user/wallet/deposit-request', {
        amount: parsedAmount,
        paymentChannel: 'BANK' // ✅ sửa đúng field backend yêu cầu
      });

      setResponse(res.data);
      setError('');
      setChecking(true);
    } catch (err) {
      console.error('Lỗi gửi yêu cầu:', err.response || err);
      setError('Gửi yêu cầu nạp tiền thất bại. Vui lòng thử lại.');
      setResponse(null);
    }
  };

  // Tự động kiểm tra trạng thái nạp tiền
  useEffect(() => {
    if (!checking || !response?.transaction_code) return;

    const intervalId = setInterval(async () => {
      try {
        const res = await apiClient.get('/user/wallet/deposit-status', {
          params: { transaction_code: response.transaction_code },
        });

        if (res.data.status === 'VERIFIED') {
          alert('✅ Nạp tiền thành công!');
          clearInterval(intervalId);
          window.location.reload();
        }
      } catch (err) {
        console.error('Lỗi kiểm tra trạng thái:', err);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [checking, response]);

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Nạp tiền vào tài khoản</h3>

      {response ? (
        <>
          <Alert variant="success">
            Gửi yêu cầu thành công! Quét mã QR để nạp <strong>{response.amount?.toLocaleString()} VNĐ</strong>.
          </Alert>
          <div className="text-center mt-4">
            <Image src={response.qr_url} alt="QR Code" fluid width={300} />
            <p className="mt-3">
              <strong>Mã giao dịch:</strong> {response.transaction_code}
            </p>
            <p><em>Đang chờ xác nhận giao dịch...</em></p>
          </div>
        </>
      ) : (
        <Form onSubmit={handleDeposit}>
          <Form.Group className="mb-3" controlId="formAmount">
            <Form.Label>Số tiền (VNĐ)</Form.Label>
            <Form.Control
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="10000"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formChannel">
            <Form.Label>Phương thức thanh toán</Form.Label>
            <Form.Select value={channel} onChange={(e) => setChannel(e.target.value)}>
              <option value="BANK">Chuyển khoản ngân hàng (TPBank)</option>
              <option value="ZALOPAY">ZaloPay</option>
              <option value="MOMO">Momo</option>
            </Form.Select>
          </Form.Group>

          <Button variant="danger" type="submit">
            Nạp tiền
          </Button>
          {error && <p className="text-danger mt-2">{error}</p>}
        </Form>
      )}
    </div>
  );
};

export default DepositPage;
