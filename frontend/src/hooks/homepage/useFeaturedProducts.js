import { useState, useEffect } from 'react';
import { homepageAPI } from '../../services/homepage';

const getTimeLeft = (endTime) => {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end - now;

  if (isNaN(end.getTime()) || diff <= 0) {
    return { label: 'Đã kết thúc', isEnded: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  let label = '';
  if (days > 0) label = `${days} ngày ${hours} giờ`;
  else if (hours > 0) label = `${hours} giờ ${minutes} phút`;
  else label = `${minutes} phút`;

  return { label, isEnded: false };
};

export default function useFeaturedProducts() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAssets = async () => {
      setLoading(true);
      try {
        const res = await homepageAPI.getUpcomingAssets();
        const raw = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        const enriched = raw.map((item) => {
          const endTime = new Date(item.endDateTime || item.endTime || new Date());
          const { label, isEnded } = getTimeLeft(endTime);

          return {
            id: item.id,
            name: item.title || item.name || 'Tài sản không tên',
            price: item.startPrice || item.price || 0,
            image: item.imageUrl || item.image,
            endTime,
            timeLeftLabel: label,
            isEnded,
          };
        });
        if (isMounted) setAssets(enriched);
      } catch (err) {
        if (isMounted) {
          setError('Không thể tải dữ liệu từ server.');
          setAssets([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAssets();
    return () => { isMounted = false; };
  }, []);

  return { assets, loading, error };
}
