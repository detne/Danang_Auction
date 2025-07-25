import { useState, useEffect } from 'react';
import { homepageAPI } from '../../services/homepage';
import DauGiaImg from '../../assets/NewsSection/Dau_gia.png';
import NghiLeImg from '../../assets/NewsSection/Nghi_le.png';
import HuongDanImg from '../../assets/NewsSection/Huong_dan.png';

export default function useNewsSection() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        homepageAPI.getNews()
            .then(res => {
                let data = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
                const defaultImages = [HuongDanImg, NghiLeImg, DauGiaImg];

                // Hàm kiểm tra link ảnh hợp lệ (không phải ảnh lỗi BE)
                const isValidImage = url =>
                    url &&
                    !url.startsWith('/images/') &&
                    !url.endsWith('.php') &&
                    !url.endsWith('.asp') &&
                    !url.endsWith('.jsp');

                data = data.map((item, idx) => ({
                    ...item,
                    imageUrl: isValidImage(item.imageUrl)
                        ? item.imageUrl
                        : isValidImage(item.image)
                            ? item.image
                            : defaultImages[idx % defaultImages.length]
                }));

                // Log kiểm tra
                console.log('news data after map:', data);

                if (isMounted) setNews(data);
            })
            .catch((e) => {
                setError('Không thể tải tin tức từ server.');
                setNews([]);
                console.error('Lỗi khi lấy news:', e);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });
        return () => { isMounted = false; };
    }, []);

    return { news, loading, error };
}
