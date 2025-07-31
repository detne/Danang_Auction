import { useEffect, useState } from 'react';
import { walletAPI } from '../../services/wallet';
import { useUser } from './useUser'; // ✅ import đúng hook có sẵn

export const useBalance = () => {
  const [balance, setBalance] = useState(0);
  const user = useUser(); // ✅ lấy user từ useUser()

  const fetchBalance = async () => {
    try {
      const res = await walletAPI.getBalance();
      setBalance(res.balance || 0);
    } catch (err) {
      console.error('❌ Lỗi khi lấy số dư:', err);
      setBalance(0);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'BIDDER') return; // Chặn Organizer

    fetchBalance();
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [user]);

  return balance;
};
