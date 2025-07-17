import { useState, useEffect } from 'react';
import { homepageAPI } from '../../services/homepage';

export default function useFooterInfo() {
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    homepageAPI.getFooterInfo()
        .then(res => {
          const data = res?.data || res;

          const isValid =
              data &&
              typeof data === 'object' &&
              Array.isArray(data.links) &&
              Array.isArray(data.social) &&
              typeof data.contact === 'object';

          if (isMounted) {
            setFooterData(isValid ? data : null); // fallback nếu sai format
          }
        })
        .catch(() => {
          if (isMounted) {
            setError('Không thể tải dữ liệu từ server.');
            setFooterData(null);
          }
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });

    return () => {
      isMounted = false;
    };
  }, []);

  return { footerData, loading, error };
}
