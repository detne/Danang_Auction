// src/services/wallet.js
import apiClient from './api';

export const walletAPI = {
  // 🏦 Lấy số dư ví hiện tại
  getBalance: () => apiClient.get('/user/wallet/balance'),

  // 💳 Lấy lịch sử thanh toán của người dùng
  getMyPayments: (token) =>
    apiClient.get('/user/payments/my-history', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

  // 🧾 Tạo mã QR nạp tiền
  createQR: (amount) => apiClient.post('/payments/create-qr', { amount }),
};
