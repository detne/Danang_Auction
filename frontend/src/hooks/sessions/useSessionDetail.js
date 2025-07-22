// src/hooks/sessions/useSessionDetail.js
import { useEffect, useState } from 'react';
import { sessionAPI } from '../../services/session';

const useSessionDetail = (sessionCode) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    sessionAPI.getSessionDetailByCode(sessionCode)
      .then((res) => {
        setSession(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Không thể tải dữ liệu phiên đấu giá.');
        setLoading(false);
      });
  }, [sessionCode]);

  return { session, loading, error };
};

export default useSessionDetail;
