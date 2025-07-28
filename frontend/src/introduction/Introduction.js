import React, { useState, useEffect, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import '../styles/Introduction.css'; // File CSS mới

// Import hình ảnh
import pioneer from '../assets/introduction/pioneer.png';
import transparency from '../assets/introduction/transparency.jpg';
import convenience from '../assets/introduction/convenience.jpg';
import security from '../assets/introduction/security.jpg';
import support from '../assets/introduction/support.jpg';
import vision from '../assets/introduction/vision.png';
import mission from '../assets/introduction/mission.png';
import users from '../assets/introduction/users.png';
import auctions from '../assets/introduction/auctions.jpg';
import success from '../assets/introduction/success.jpg';
import supportIcon from '../assets/introduction/support-icon.png';

// Component card được memo để ngăn re-render không cần thiết
const IntroductionCard = memo(({ section }) => (
    <div className="intro-card">
        <div className="card-image-container">
            <img
                src={section.imageUrl}
                alt={section.title}
                className="card-image"
                loading="lazy"
                onError={(e) => (e.target.src = '/assets/introduction/fallback.jpg')}
            />
        </div>
        <div className="card-content">
            <h3 className="card-title">{section.title}</h3>
            <p className="card-description">{section.description}</p>
            <Link to="/introduction" className="card-link">
                Tìm hiểu thêm
            </Link>
        </div>
    </div>
));

const Introduction = () => {
    const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
    const [isLoaded, setIsLoaded] = useState(false);
    const { user } = useUser();

    // Đồng bộ dark mode với body và localStorage
    useEffect(() => {
        document.body.classList.toggle('dark-mode', darkMode);
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    // Đánh dấu loaded để chạy animation một lần
    useEffect(() => {
        setIsLoaded(true);
    }, []);

    // Sử dụng useMemo để tối ưu dữ liệu tĩnh
    const introSections = useMemo(
        () => [
            {
                id: 1,
                title: 'Tiên phong trong đấu giá trực tuyến',
                description:
                    'Chúng tôi dẫn đầu trong việc cung cấp nền tảng đấu giá trực tuyến minh bạch, an toàn và hiệu quả, mang đến trải nghiệm hiện đại cho mọi người dùng.',
                imageUrl: pioneer,
            },
            {
                id: 2,
                title: 'Minh bạch và công bằng',
                description:
                    'Mọi giao dịch được thực hiện công khai, với quy trình rõ ràng, đảm bảo tính công bằng cho tất cả người tham gia.',
                imageUrl: transparency,
            },
            {
                id: 3,
                title: 'Tiện lợi mọi lúc, mọi nơi',
                description:
                    'Tham gia đấu giá dễ dàng từ bất kỳ thiết bị nào, với giao diện thân thiện và công nghệ tiên tiến.',
                imageUrl: convenience,
            },
            {
                id: 4,
                title: 'An toàn và bảo mật',
                description:
                    'Áp dụng công nghệ mã hóa tiên tiến để bảo vệ dữ liệu người dùng và đảm bảo an toàn cho mọi giao dịch.',
                imageUrl: security,
            },
            {
                id: 5,
                title: 'Hỗ trợ 24/7',
                description:
                    'Đội ngũ hỗ trợ chuyên nghiệp sẵn sàng giải đáp mọi thắc mắc, đảm bảo trải nghiệm mượt mà cho người dùng.',
                imageUrl: support,
            },
        ],
        []
    );

    const stats = useMemo(
        () => [
            { value: '10,000+', label: 'Người dùng đăng ký', icon: users },
            { value: '5,000+', label: 'Phiên đấu giá hoàn tất', icon: auctions },
            { value: '99.9%', label: 'Tỷ lệ giao dịch thành công', icon: success },
            { value: '24/7', label: 'Hỗ trợ khách hàng', icon: supportIcon },
        ],
        []
    );

    return (
        <div className={`intro-section ${darkMode ? 'dark' : ''}`}>
            {/* Header */}
            <div className="header-5">
                <div className="header-content-5">
                    <h1 className="header-title-5">Giới Thiệu DaNangAuction</h1>
                    <div className="breadcrumb-5">
                        <Link to="/" className="breadcrumb-link-5">
                            Trang chủ
                        </Link>
                        <span className="breadcrumb-divider-5">/</span>
                        <span>Giới Thiệu</span>
                    </div>
                </div>
                {user?.role === 'ADMIN' && <button className="edit-button">+ Chỉnh sửa nội dung</button>}
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="content-container">
                    {/* Giới thiệu chính */}
                    <div className="intro-main">
                        <h2 className="intro-title">Chào mừng đến với DaNangAuction</h2>
                        <p className="intro-description">
                        Công ty Đấu giá Hợp danh Lạc Việt là đơn vị chuyên nghiệp trong lĩnh vực đấu giá tài sản, được thành lập bởi đội ngũ đấu giá viên giàu kinh nghiệm, hoạt động trên toàn quốc với nhiều chi nhánh tại Hà Nội, TP. Hồ Chí Minh, Đà Nẵng. Chúng tôi cam kết mang đến dịch vụ đấu giá hiệu quả, minh bạch và tối ưu lợi ích cho khách hàng.
                        </p>
                        <Link to="/signup" className="signup-button">
                            Đăng ký ngay
                        </Link>
                    </div>

                    {/* Grid giới thiệu */}
                    <div className="intro-grid">
                        {introSections.map((section) => (
                            <IntroductionCard key={section.id} section={section} />
                        ))}
                    </div>

                    {/* Tầm nhìn và sứ mệnh */}
                    <div className="vision-mission">
                        <div className="vision-mission-grid">
                            <div className="vision">
                                <div className="vision-content">
                                    <img
                                        src={vision}
                                        alt="Tầm nhìn"
                                        className="section-image"
                                        loading="lazy"
                                        onError={(e) => (e.target.src = '/assets/introduction/fallback.jpg')}
                                    />
                                    <div className="text-content">
                                        <h3 className="section-title">Tầm nhìn</h3>
                                        <p className="section-description">
                                            Trở thành nền tảng đấu giá trực tuyến hàng đầu khu vực, mang đến giải pháp đấu giá hiện đại, minh bạch và dễ tiếp cận cho mọi cá nhân và tổ chức.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mission">
                                <div className="mission-content">
                                    <img
                                        src={mission}
                                        alt="Sứ mệnh"
                                        className="section-image"
                                        loading="lazy"
                                        onError={(e) => (e.target.src = '/assets/introduction/fallback.jpg')}
                                    />
                                    <div className="text-content">
                                        <h3 className="section-title">Sứ mệnh</h3>
                                        <p className="section-description">
                                            Cung cấp một môi trường đấu giá an toàn, công bằng và hiệu quả, giúp người dùng dễ dàng tham gia và đạt được giá trị tối ưu từ các giao dịch.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Giá trị cốt lõi */}
                    <div className="core-values">
                        <h3 className="core-values-title">Giá trị cốt lõi</h3>
                        <div className="core-values-grid">
                            <div className="value-item">
                                <h4 className="value-title">Chuyên nghiệp</h4>
                                <p className="value-description">Đội ngũ giàu kinh nghiệm, quy trình chuẩn hóa.</p>
                            </div>
                            <div className="value-item">
                                <h4 className="value-title">Đổi mới</h4>
                                <p className="value-description">Ứng dụng công nghệ tiên tiến để cải thiện trải nghiệm.</p>
                            </div>
                            <div className="value-item">
                                <h4 className="value-title">Khách hàng là trung tâm</h4>
                                <p className="value-description">Luôn đặt lợi ích và trải nghiệm của khách hàng lên hàng đầu.</p>
                            </div>
                        </div>
                    </div>

                    {/* Số liệu thống kê */}
                    <div className="stats">
                        <h3 className="stats-title">Thành tựu của chúng tôi</h3>
                        <div className="stats-grid">
                            {stats.map((stat, index) => (
                                <div key={index} className="stat-item">
                                    <img
                                        src={stat.icon}
                                        alt={stat.label}
                                        className="stat-icon"
                                        loading="lazy"
                                        onError={(e) => (e.target.src = '/assets/introduction/fallback-icon.png')}
                                    />
                                    <div>
                                        <h4 className="stat-value">{stat.value}</h4>
                                        <p className="stat-label">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Lời kêu gọi hành động */}
                    <div className="cta">
                        <h3 className="cta-title">Sẵn sàng tham gia đấu giá?</h3>
                        <p className="cta-description">
                            Đăng ký ngay hôm nay để khám phá các phiên đấu giá hấp dẫn và cơ hội sở hữu những tài sản giá trị với DaNangAuction!
                        </p>
                        <Link to="/signup" className="cta-button">
                            Bắt đầu ngay
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Introduction;