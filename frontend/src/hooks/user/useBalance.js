import { useEffect, useState } from 'react';
import { walletAPI } from '../../services/wallet'; // ✅ đúng như cách bạn làm với auth

export const useBalance = () => {
  const [balance, setBalance] = useState(0);

  const fetchBalance = async () => {
    try {
      const res = await walletAPI.getBalance();
      setBalance(res.balance); // hoặc res.data?.balance tuỳ response
    } catch (err) {
      console.error('❌ Lỗi khi lấy số dư:', err);
    }
  };

  useEffect(() => {
    fetchBalance();
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, []);

  return balance;
};
