import { useState, useEffect } from 'react';
import { homepageAPI } from '../../services/homepage';

export default function usePastAuctionsSection() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        homepageAPI.getPastAuctions()
            .then(res => {
                const rawList = Array.isArray(res?.data)
                    ? res.data
                    : Array.isArray(res) ? res : [];

                // Lọc đúng phiên đã kết thúc (status === 'FINISHED')
                const filtered = rawList.filter(item => item.status === 'FINISHED');

                const transformedData = filtered.map(item => {
                    const imageUrl =
                        item.thumbnail_url ||
                        item.thumbnailUrl ||
                        item.image_url ||
                        item.imageUrl ||
                        item.images?.[0]?.url ||
                        item.document?.images?.[0]?.url ||
                        '/images/past-auction-default.jpg';

                    return {
                        id: item.id,
                        name: item.title || item.name || 'Phiên đấu giá không tên',
                        soldDate: item.end_time
                            ? new Date(item.end_time).toLocaleDateString('vi-VN')
                            : 'Chưa xác định',
                        sessionCode: item.session_code || item.sessionCode || 'N/A',
                        status: item.status,
                        imageUrl,
                        finalPrice: item.final_price ?? 0,
                        winner: item.winner ?? 'Ẩn danh',
                    };
                });

                if (isMounted) {
                    setItems(transformedData);
                    setLoading(false);
                }
            })
            .catch(err => {
                console.error('❌ Error fetching past auctions:', err);
                if (isMounted) {
                    setError('Không thể tải dữ liệu phiên đã đấu giá.');
                    setItems([]);
                    setLoading(false);
                }
            });

        return () => { isMounted = false; };
    }, []);

    return { items, loading, error };
}
