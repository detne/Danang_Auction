import { useState, useEffect } from 'react';
import { authAPI } from '../../services/auth';

export default function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    authAPI.getProfile()
        .then(res => {
          if (isMounted) setProfile(res.data || res);
        })
        .catch(() => {
          setError('Không thể tải thông tin hồ sơ.');
          setProfile(null);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    return () => { isMounted = false; };
  }, []);

  return { profile, loading, error };
}