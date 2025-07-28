// src/hooks/useAdminAuctions.js
import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/admin';

const useAdminAuctions = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const res = await adminAPI.getAuctions();
                if (res.success) {
                    setAuctions(res.data || []);
                } else {
                    setError(res.message || 'Không thể tải dữ liệu phiên đấu giá');
                }
            } catch (err) {
                setError(err.message || 'Lỗi khi gọi API phiên đấu giá');
            } finally {
                setLoading(false);
            }
        };

        fetchAuctions();
    }, []);

    return { auctions, loading, error };
};

export default useAdminAuctions;
