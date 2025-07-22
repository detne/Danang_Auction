import { useState, useEffect } from 'react';
import { homepageAPI } from '../../services/homepage';

export default function useNewsSection() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    homepageAPI.getNews()
      .then(res => {
        const data = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        if (isMounted) setNews(data);
      })
      .catch(() => {
        setError('Không thể tải tin tức từ server.');
        setNews([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  return { news, loading, error };
}

