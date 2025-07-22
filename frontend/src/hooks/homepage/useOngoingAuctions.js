import { useState, useEffect } from 'react';
import { homepageAPI } from '../../services/homepage';

export default function useOngoingAuctions() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    homepageAPI.getPastAuctions()
      .then(res => {
        const data = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        // Filter only ongoing auctions
        const ongoing = data.filter(item => item.status === 'Đang diễn ra');
        if (isMounted) setAuctions(ongoing);
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

