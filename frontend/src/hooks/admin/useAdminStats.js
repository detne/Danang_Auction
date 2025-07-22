// src/hooks/useAdminStats.js
import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/admin';

const useAdminStats = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalAuctions: 0,
        totalRevenue: 0,
        activeAuctions: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await adminAPI.getSystemSummary();
                if (res.success) {
                    setStats(res.data);
                } else {
                    setError(res.message || 'Không thể tải thống kê');
                }
            } catch (err) {
                setError(err.message || 'Lỗi khi tải thống kê');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return { stats, loading, error };
};

export default useAdminStats;