import { useState, useEffect } from 'react';
import { homepageAPI } from '../../services/homepage';

export default function usePartners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    homepageAPI.getPartners()
      .then(res => {
        const data = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        if (isMounted) setPartners(data);
      })
      .catch(() => {
        setError('Không thể tải dữ liệu từ server.');
        setPartners([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  return { partners, loading, error };
}

