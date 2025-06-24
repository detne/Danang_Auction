import React, { useEffect, useState } from 'react';
import '../styles/Banner.css';
import { getBanner } from '../services/api'; // <-- Gọi API mới

const Banner = () => {
    const [bannerData, setBannerData] = useState({
        title: '',
        description: '',
        imageUrl: '',
    });

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const data = await getBanner();
                setBannerData(data);
            } catch (error) {
                console.error('Lỗi khi tải banner:', error);
            }
        };
        fetchBanner();
    }, []);

    return (
        <div
            className="banner"
            style={{
                backgroundImage: `url(${bannerData.imageUrl || '/default-banner.jpg'})`,
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