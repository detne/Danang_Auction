// src/hooks/organizer/useAssets.js
import { useState, useEffect } from 'react';
import { assetAPI } from '../../services/asset';

const useAssets = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAssets = async () => {
        setLoading(true);
        try {
            const response = await assetAPI.searchAssets();
            if (response.success) {
                setAssets(response.data || []);
            } else {
                setError('Không thể tải danh sách tài sản');
            }
        } catch (err) {
            setError(err.message || 'Lỗi không xác định');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    return { assets, loading, error, refetch: fetchAssets };
};

export default useAssets;