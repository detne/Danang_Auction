import React, { useState, useEffect, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import '../styles/Introduction.css';

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
    <div className="introduction-card loaded">
        <div className="card-image-wrapper">
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
            <p className="card-excerpt">{section.description}</p>
            <Link to="/introduction" className="read-more-btn">
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
        <div className={`introduction-section ${darkMode ? 'dark' : ''}`}>
            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <h1 className="section-title">Giới Thiệu DaNangAuction</h1>
                    <div className="breadcrumb">
                        <Link to="/">Trang chủ</Link>
                        <span className="breadcrumb-separator">/</span>
                        <span>Giới Thiệu</span>
                    </div>
                </div>
                <button className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? '☀️' : '🌙'}
                </button>
                {user?.role === 'ADMIN' && <button className="create-btn">+ Chỉnh sửa nội dung</button>}
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="content-area">
                    {/* Giới thiệu chính */}
                    <div className="intro-main text-center mb-16 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-gray-800 dark:to-gray-700 py-12 rounded-lg">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Chào mừng đến với DaNangAuction
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                            DaNangAuction là nền tảng đấu giá trực tuyến hàng đầu tại Việt Nam, tiên phong trong việc ứng
                            dụng công nghệ để mang lại trải nghiệm minh bạch, tiện lợi và an toàn. Chúng tôi cam kết cung
                            cấp cơ hội đầu tư và sở hữu các tài sản giá trị với quy trình công bằng và chuyên nghiệp. Hãy
                            tham gia ngay để khám phá các phiên đấu giá độc đáo và cơ hội sở hữu tài sản mơ ước của bạn!
                        </p>
                        <Link
                            to="/signup"
                            className="inline-block bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
                        >
                            Đăng ký ngay
                        </Link>
                    </div>

                    {/* Grid giới thiệu */}
                    <div className="introduction-grid">
                        {introSections.map((section) => (
                            <IntroductionCard key={section.id} section={section} />
                        ))}
                    </div>

                    {/* Tầm nhìn và sứ mệnh */}
                    <div className="vision-mission-section mt-16">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="vision bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-start">
                                <div className="image-title-wrapper">
                                    <img
                                        src={vision}
                                        alt="Tầm nhìn"
                                        className="section-image w-24 h-24 object-cover rounded-md mb-4"
                                        loading="lazy"
                                        onError={(e) => (e.target.src = '/assets/introduction/fallback.jpg')}
                                    />
                                    <div className="content-wrapper">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Tầm nhìn</h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Trở thành nền tảng đấu giá trực tuyến hàng đầu khu vực, mang đến giải pháp đấu giá hiện
                                            đại, minh bạch và dễ tiếp cận cho mọi cá nhân và tổ chức.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mission bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-start">
                                <div className="image-title-wrapper">
                                    <img
                                        src={mission}
                                        alt="Sứ mệnh"
                                        className="section-image w-24 h-24 object-cover rounded-md mb-4"
                                        loading="lazy"
                                        onError={(e) => (e.target.src = '/assets/introduction/fallback.jpg')}
                                    />
                                    <div className="content-wrapper">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Sứ mệnh</h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Cung cấp một môi trường đấu giá an toàn, công bằng và hiệu quả, giúp người dùng dễ dàng
                                            tham gia và đạt được giá trị tối ưu từ các giao dịch.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Giá trị cốt lõi */}
                    <div className="core-values-section mt-16 text-center">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Giá trị cốt lõi</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            <div className="value-item bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Chuyên nghiệp</h4>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Đội ngũ giàu kinh nghiệm, quy trình chuẩn hóa.
                                </p>
                            </div>
                            <div className="value-item bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Đổi mới</h4>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Ứng dụng công nghệ tiên tiến để cải thiện trải nghiệm.
                                </p>
                            </div>
                            <div className="value-item bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    Khách hàng là trung tâm
                                </h4>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Luôn đặt lợi ích và trải nghiệm của khách hàng lên hàng đầu.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Số liệu thống kê */}
                    <div className="stats-section mt-16 text-center">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Thành tựu của chúng tôi</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="stat-item bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center"
                                >
                                    <img
                                        src={stat.icon}
                                        alt={stat.label}
                                        className="stat-icon w-12 h-12 object-contain mr-4"
                                        loading="lazy"
                                        onError={(e) => (e.target.src = '/assets/introduction/fallback-icon.png')}
                                    />
                                    <div>
                                        <h4 className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stat.value}</h4>
                                        <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Lời kêu gọi hành động */}
                    <div className="cta-section mt-16 text-center bg-gradient-to-r from-blue-600 to-blue-800 dark:from-gray-700 dark:to-gray-900 py-12 rounded-lg">
                        <h3 className="text-2xl font-bold text-white mb-4">Sẵn sàng tham gia đấu giá?</h3>
                        <p className="text-white mb-6 max-w-2xl mx-auto">
                            Đăng ký ngay hôm nay để khám phá các phiên đấu giá hấp dẫn và cơ hội sở hữu những tài sản
                            giá trị với DaNangAuction!
                        </p>
                        <Link
                            to="/signup"
                            className="inline-block bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-300 shadow-md"
                        >
                            Bắt đầu ngay
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Introduction;