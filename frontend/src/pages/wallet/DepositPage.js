import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/api';

const DepositPage = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [qrData, setQrData] = useState(null);
  const [error, setError] = useState(null);
  const [loading] = useState(false);

  const handleCreateQR = async () => {
    try {
      const data = await apiClient.post('/user/wallet/deposit-request', { amount });

      if (data?.success && data.qrUrl) {
        setQrData({
          amount: data.amount,
          content: data.content,
          qrUrl: data.qrUrl,
        });
        setError(null);
      } else {
        setQrData(null);
        setError("Không thể tạo mã QR. Vui lòng thử lại sau.");
      }
    } catch (err) {
      console.error(err);
      setQrData(null);
      setError("Không thể tạo mã QR. Vui lòng thử lại.");
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">💰 Nạp tiền vào tài khoản</h2>

      <Form.Group className="mb-3">
        <Form.Label>Số tiền (VND)</Form.Label>
        <Form.Control
          type="number"
          min="1000"
          step="1000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Nhập số tiền cần nạp"
          required
        />
      </Form.Group>

      <div className="d-flex gap-2">
        <Button variant="success" onClick={handleCreateQR} disabled={loading || !amount}>
          {loading ? 'Đang tạo mã QR...' : 'TẠO MÃ QR NẠP TIỀN'}
        </Button>

        <Button variant="outline-primary" onClick={() => navigate('/wallet/history')}>
          Xem hồ sơ giao dịch
        </Button>
      </div>

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

      {qrData && qrData.qrUrl && (
        <div className="mt-4 d-flex justify-content-center">
          <div
            className="p-4 border rounded shadow-sm"
            style={{ maxWidth: '400px', backgroundColor: '#f9f9f9' }}
          >
            <h5 className="text-center mb-3">
              📲 Quét mã QR để nạp <strong>{Number(qrData.amount).toLocaleString('vi-VN')} VND</strong>
            </h5>

            <div className="mb-2">
              <strong>👤 Người nhận:</strong> {qrData.bankAccountName || 'NGUYEN SONG GIA HUY'}
            </div>
            <div className="mb-2">
              <strong>🏦 Số tài khoản:</strong> {qrData.bankAccountNumber || '00000012421'}
            </div>
            <div className="mb-3">
              <strong>✉️ Nội dung chuyển khoản:</strong>{' '}
              <span className="text-primary">{qrData.content}</span>
            </div>

            <div className="text-center">
              <img
                src={qrData.qrUrl}
                alt="QR Code"
                className="img-fluid"
                style={{ maxWidth: '260px', border: '1px solid #ccc', borderRadius: '8px' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepositPage;