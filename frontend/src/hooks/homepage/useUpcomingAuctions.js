import { useState, useEffect } from 'react';
import { homepageAPI } from '../../services/homepage';

export default function useUpcomingAuctions() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await homepageAPI.getUpcomingAssets();
        const data = Array.isArray(res?.data) ? res.data : [];

        if (isMounted) {
          setAuctions(data);
        }
      } catch (err) {
        if (isMounted) {
          setError('Không thể tải dữ liệu từ server.');
          setAuctions([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { auctions, loading, error };
}