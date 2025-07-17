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
            const response = await assetAPI.getMyAssets();
            if (response.success) {
                setAssets(response.data || []);
            } else {
                // In đầy đủ mọi thứ nhận được
                console.error('API getMyAssets error:', response);
                alert('API getMyAssets error: ' + JSON.stringify(response, null, 2));
                setError(response.message || 'Không thể tải tài sản');
            }
        } catch (err) {
            // Log toàn bộ err và err.response (nếu có)
            console.error('Exception when fetching assets:', err, err?.response);
            alert('Exception: ' + JSON.stringify(err?.response || err, null, 2));
            setError(err?.response?.message || err?.message || 'Không thể tải tài sản');
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