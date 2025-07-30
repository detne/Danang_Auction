import { useState, useEffect } from 'react';
import apiClient from '../../services/api'; // Import apiClient trực tiếp vì homepageAPI không có getOngoing

export default function useOngoingAuctions() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    apiClient.get('/sessions', {
      params: {
        status: 'ACTIVE', // Hoặc 'ONGOING' nếu enum backend thay đổi, nhưng theo DB là 'ACTIVE'
        type: 'PUBLIC', // Chỉ lấy public, nếu cần private thì thêm logic auth
      }
    })
        .then(res => {
          const data = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
          // Không cần filter nữa vì backend đã filter status 'ACTIVE'
          // Nhưng nếu backend trả status tiếng Việt, thì filter 'Đang diễn ra' nếu cần
          if (isMounted) setAuctions(data);
        })
        .catch(() => {
          setError('Không thể tải dữ liệu từ server.');
          setAuctions([]);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    return () => { isMounted = false; };
  }, []);

  return { auctions, loading, error };
}