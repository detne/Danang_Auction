// src/components/homepage/Banner.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import bannerImage from '../../assets/banner.jpg';
import '../../styles/Banner.css';
import { USER_ROLES } from "../../utils/constants";

const Banner = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    const handleButtonClick = () => {
        if (user && user.role === USER_ROLES.ORGANIZER) {
            navigate('/asset-management');
        } else {
            navigate('/upcoming-auctions');
        }
    };

    return (
        <div
            className="banner"
            style={{ backgroundImage: `url(${bannerImage})` }}
        >
            <div className="banner-content">
                <h2>Chào mừng đến với DaNangAuction</h2>
                <p>Tham gia đấu giá trực tuyến dễ dàng và nhanh chóng!</p>
                <button onClick={handleButtonClick}>
                    {user && user.role === USER_ROLES.ORGANIZER ? 'Tạo và Upload Tài sản' : 'Khám phá ngay'}
                </button>
            </div>
        </div>
    );
};

export default Banner;
