import React, { useState, useEffect, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import '../styles/Introduction.css';

// Import hình ảnh (giữ nguyên)
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
const IntroductionCard = memo(({ section, index }) => (
    <div className={`intro-card ${index % 2 === 0 ? 'slide-left' : 'slide-right'}`}>
        <div className="card-image-container">
            <img
                src={section.imageUrl}
                alt={section.title}
                className="card-image"
                loading="lazy"
                onError={(e) => (e.target.src = '/assets/introduction/fallback.jpg')}
            />
            <div className="card-overlay"></div>
        </div>
        <div className="card-content">
            <div className="card-number">{String(index + 1).padStart(2, '0')}</div>
            <h3 className="card-title">{section.title}</h3>
            <p className="card-description">{section.description}</p>
            <div className="card-footer">
                <Link to="/introduction" className="card-link">
                    <span>Tìm hiểu thêm</span>
                    <svg className="arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </Link>
            </div>
        </div>
    </div>
));

const StatCard = memo(({ stat, index }) => (
    <div className="stat-item" style={{ animationDelay: `${index * 0.1}s` }}>
        <div className="stat-icon-container">
            <img
                src={stat.icon}
                alt={stat.label}
                className="stat-icon"
                loading="lazy"
                onError={(e) => (e.target.src = '/assets/introduction/fallback-icon.png')}
            />
        </div>
        <div className="stat-content">
            <h4 className="stat-value">{stat.value}</h4>
            <p className="stat-label">{stat.label}</p>
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

    const coreValues = useMemo(
        () => [
            {
                title: 'Chuyên nghiệp',
                description: 'Đội ngũ giàu kinh nghiệm, quy trình chuẩn hóa.',
                icon: '🎯'
            },
            {
                title: 'Đổi mới',
                description: 'Ứng dụng công nghệ tiên tiến để cải thiện trải nghiệm.',
                icon: '💡'
            },
            {
                title: 'Khách hàng là trung tâm',
                description: 'Luôn đặt lợi ích và trải nghiệm của khách hàng lên hàng đầu.',
                icon: '❤️'
            },
        ],
        []
    );

    return (
        <div className={`intro-section ${darkMode ? 'dark' : ''} ${isLoaded ? 'loaded' : ''}`}>
            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-background">
                    <div className="hero-overlay"></div>
                </div>
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">
                            Chào mừng đến với <span className="highlight">DaNangAuction</span>
                        </h1>
                        <p className="hero-description">
                            Công ty Đấu giá Hợp danh Da Nang là đơn vị chuyên nghiệp trong lĩnh vực đấu giá tài sản,
                            được thành lập bởi đội ngũ đấu giá viên giàu kinh nghiệm, hoạt động trên toàn quốc với
                            nhiều chi nhánh tại Hà Nội, TP. Hồ Chí Minh, Đà Nẵng.
                        </p>
                        <div className="hero-buttons">
                            <Link to="/signup" className="primary-button">
                                <span>Đăng ký ngay</span>
                                <svg className="button-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </Link>
                            <Link to="/auctions" className="secondary-button">
                                Khám phá đấu giá
                            </Link>
                        </div>
                    </div>
                    {user?.role === 'ADMIN' && (
                        <button className="edit-button">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Chỉnh sửa nội dung
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="content-container">
                    {/* Features Grid */}
                    <section className="features-section">
                        <div className="section-header">
                            <h2 className="section-title">Tại sao chọn chúng tôi?</h2>
                            <p className="section-subtitle">
                                Khám phá những ưu điểm vượt trội của nền tảng đấu giá hàng đầu
                            </p>
                        </div>
                        <div className="intro-grid">
                            {introSections.map((section, index) => (
                                <IntroductionCard key={section.id} section={section} index={index} />
                            ))}
                        </div>
                    </section>

                    {/* Vision & Mission */}
                    <section className="vision-mission-section">
                        <div className="vision-mission-grid">
                            <div className="vision-card">
                                <div className="card-header">
                                    <div className="icon-container vision-icon">
                                        <img src={vision} alt="Tầm nhìn" className="section-image" />
                                    </div>
                                    <h3 className="card-title">Tầm nhìn</h3>
                                </div>
                                <p className="card-description">
                                    Trở thành nền tảng đấu giá trực tuyến hàng đầu khu vực, mang đến giải pháp
                                    đấu giá hiện đại, minh bạch và dễ tiếp cận cho mọi cá nhân và tổ chức.
                                </p>
                            </div>
                            <div className="mission-card">
                                <div className="card-header">
                                    <div className="icon-container mission-icon">
                                        <img src={mission} alt="Sứ mệnh" className="section-image" />
                                    </div>
                                    <h3 className="card-title">Sứ mệnh</h3>
                                </div>
                                <p className="card-description">
                                    Cung cấp một môi trường đấu giá an toàn, công bằng và hiệu quả, giúp người dùng
                                    dễ dàng tham gia và đạt được giá trị tối ưu từ các giao dịch.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Core Values */}
                    <section className="core-values-section">
                        <div className="section-header">
                            <h3 className="section-title">Giá trị cốt lõi</h3>
                            <p className="section-subtitle">
                                Những nguyên tắc định hướng mọi hoạt động của chúng tôi
                            </p>
                        </div>
                        <div className="core-values-grid">
                            {coreValues.map((value, index) => (
                                <div key={index} className="value-card">
                                    <div className="value-icon">{value.icon}</div>
                                    <h4 className="value-title">{value.title}</h4>
                                    <p className="value-description">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Statistics */}
                    <section className="stats-section">
                        <div className="section-header">
                            <h3 className="section-title">Thành tựu của chúng tôi</h3>
                            <p className="section-subtitle">
                                Những con số minh chứng cho sự tin tưởng của khách hàng
                            </p>
                        </div>
                        <div className="stats-grid">
                            {stats.map((stat, index) => (
                                <StatCard key={index} stat={stat} index={index} />
                            ))}
                        </div>
                    </section>

                    {/* Call to Action */}
                    <section className="cta-section">
                        <div className="cta-content">
                            <h3 className="cta-title">Sẵn sàng tham gia đấu giá?</h3>
                            <p className="cta-description">
                                Đăng ký ngay hôm nay để khám phá các phiên đấu giá hấp dẫn và cơ hội sở hữu
                                những tài sản giá trị với DaNangAuction!
                            </p>
                            <div className="cta-buttons">
                                <Link to="/signup" className="cta-primary-button">
                                    <span>Bắt đầu ngay</span>
                                    <svg className="button-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </Link>
                                <Link to="/contact" className="cta-secondary-button">
                                    Liên hệ tư vấn
                                </Link>
                            </div>
                        </div>
                        <div className="cta-decoration">
                            <div className="decoration-circle circle-1"></div>
                            <div className="decoration-circle circle-2"></div>
                            <div className="decoration-circle circle-3"></div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Introduction;