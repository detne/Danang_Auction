import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useUserWonAuctions(token) {
    const [wonAuctions, setWonAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) return;
        setLoading(true);
        axios.get('http://localhost:8080/api/auctions/won-by-user', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setWonAuctions(res.data.data || res.data))
            .catch(() => setError('Không thể tải các phiên thắng cuộc'))
            .finally(() => setLoading(false));
    }, [token]);

    return { wonAuctions, loading, error };
}
