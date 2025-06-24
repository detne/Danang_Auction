import React, { useEffect, useState } from 'react';
import { getBanner } from '../services/api';
import banner from '../assets/banner.jpg'; // Fallback ảnh tĩnh
import '../styles/Banner.css';

const Banner = () => {
    const [bannerData, setBannerData] = useState({
        title: 'Chào mừng đến với DaNangAuction',
        description: 'Tham gia đấu giá trực tuyến dễ dàng và nhanh chóng!',
        imageUrl: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                setLoading(true);
                const data = await getBanner();
                if (data && typeof data === 'object') {
                    setBannerData({
                        title: data.title || 'Chào mừng đến với DaNangAuction',
                        description: data.description || 'Tham gia đấu giá trực tuyến dễ dàng và nhanh chóng!',
                        imageUrl: data.imageUrl || '',
                    });
                }
            } catch (error) {
                console.error('Lỗi khi tải banner:', error);
                setError('Không thể tải banner từ server. Sử dụng banner mặc định.');
            } finally {
                setLoading(false);
            }
        };
        fetchBanner();
    }, []);

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;

    return (
        <div
            className="banner"
            style={{
                backgroundImage: `url(${bannerData.imageUrl || banner})`, // Sử dụng banner tĩnh nếu imageUrl trống
            }}
        >
            <div className="banner-content">
                <h2>{bannerData.title}</h2>
                <p>{bannerData.description}</p>
                <button>Khám phá ngay</button>
            </div>
        </div>
    );
};

export default Banner;