import { useState, useEffect } from 'react';
import { homepageAPI } from '../../services/homepage';

export default function useEndedAuctions() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    homepageAPI.getPastAuctions()
      .then(res => {
        if (isMounted) {
          const data = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
          setAuctions(data);
        }
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

