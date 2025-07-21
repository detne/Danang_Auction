import { useState, useEffect } from 'react';
import { homepageAPI } from '../../services/homepage';

export default function usePastAuctionsSection() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true); // Loading mặc định là true
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        console.log('⏳ Fetching past auctions...');

        homepageAPI.getPastAuctions()
            .then(res => {
                const rawList = Array.isArray(res?.data) ? res.data : [];

                const transformedData = rawList.map(item => {
                    const imageUrl = (item.imageUrl && item.imageUrl !== 'null' && item.imageUrl !== 'undefined')
                        ? item.imageUrl
                        : '/images/past-auction-default.jpg';

                    return {
                        id: item.id,
                        name: item.title || item.assetDescription || `Phiên đấu giá #${item.sessionCode}`,
                        finalPrice: item.finalPrice ?? item.currentPrice ?? 0,
                        soldDate: item.endTime
                            ? new Date(item.endTime).toLocaleDateString('vi-VN')
                            : 'Chưa xác định',
                        imageUrl,
                        sessionCode: item.sessionCode,
                        winner: item.winner || 'Ẩn danh',
                        startingPrice: item.startingPrice ?? 0,
                        status: item.status || 'Đã kết thúc',
                    };
                });

                if (isMounted) {
                    setItems(transformedData);
                    setLoading(false); // ✅ Gọi setLoading sau khi setItems
                }
            })
            .catch(err => {
                console.error('❌ Error fetching past auctions:', err);
                if (isMounted) {
                    setError('Không thể tải dữ liệu từ server.');
                    setItems([]);
                    setLoading(false); // ✅ Chắc chắn set loading false luôn
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return { items, loading, error };
}
