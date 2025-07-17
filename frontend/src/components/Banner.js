import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { getBanner } from '../services/api';
import banner from '../assets/banner.jpg'; // Fallback ảnh tĩnh
import '../styles/Banner.css';

const Banner = () => {
    const { user, loading } = useUser();
    const navigate = useNavigate();
    const [bannerData, setBannerData] = useState({
        title: 'Chào mừng đến với DaNangAuction',
        description: 'Tham gia đấu giá trực tuyến dễ dàng và nhanh chóng!',
        imageUrl: '',
    });
    const [bannerLoading, setBannerLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                setBannerLoading(true);
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
                setBannerLoading(false);
            }
        };
        fetchBanner();
    }, []);

    const handleButtonClick = () => {
        if (user && user.role === 'ORGANIZER') {
            navigate('/asset-management');
        }
        // Không thực hiện điều hướng cho các role khác, bao gồm hành vi mặc định đến /upcoming-auctions
    };

    if (bannerLoading) return <div>Đang tải...</div>;
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
                <button onClick={handleButtonClick}>
                    {user && user.role === 'ORGANIZER' ? 'Tạo và Upload Tài sản' : 'Khám phá ngay'}
                </button>
            </div>
        </div>
    );
};

export default Banner;