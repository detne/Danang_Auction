import { useState, useEffect } from 'react';
import { homepageAPI } from '../../services/homepage';

export default function useUpcomingAuctions() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // giữ lại nếu muốn hiển thị có điều kiện

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await homepageAPI.getUpcomingAuctions();
        const rawList = Array.isArray(res) ? res : [];

        const transformed = rawList.map(item => {
          const imageUrl =
            item.thumbnail_url ||
            item.thumbnailUrl ||
            item.image_url ||
            item.imageUrl ||
            item.document?.images?.[0]?.url ||
            item.images?.[0]?.url ||
            '/images/upcoming-auction-default.jpg';

          return {
            id: item.id,
            name: item.title || item.name || 'Chưa có tiêu đề',
            startDate: item.start_time
              ? new Date(item.start_time).toLocaleString('vi-VN', {
                  day: 'numeric',
                  month: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })
              : 'Chưa xác định',
            sessionCode: item.session_code || item.sessionCode || 'N/A',
            startingPrice: item.starting_price || item.startingPrice || 0,
            status: item.status,
            imageUrl,
          };
        });

        if (isMounted) {
          setAuctions(transformed);
        }
      } catch (err) {
        console.error('❌ Error fetching upcoming auctions:', err);
        // Không setError để tránh hiển thị ra UI
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { auctions, loading, error: null }; // đảm bảo không trả về error nếu không dùng
}
