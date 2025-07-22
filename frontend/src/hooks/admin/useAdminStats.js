// src/hooks/admin/useAdminStats.js
import { useEffect, useState } from 'react';
import { adminAPI } from '../../services/admin';

export default function useAdminStats() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchStats() {
            setLoading(true);
            try {
                // Không destructuring { data }, vì đã trả về object trực tiếp!
                const result = await adminAPI.getSystemSummary();
                console.log('[DEBUG] summary:', result);
                setSummary(result);
            } catch (err) {
                setError('Không thể tải số liệu');
                setSummary(null);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    return { summary, loading, error };
}
