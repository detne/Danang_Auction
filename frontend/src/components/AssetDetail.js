import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/AssetDetail.css';

const AssetDetail = () => {
    const { id } = useParams(); // Lấy id từ URL

    const asset = {
        code: `MTS-${id}`,
        title: 'Lô cáp đồng đã qua sử dụng – đợt 1 năm 2025 và 01 xe ô tô ISUZU đã qua sử dụng thuộc Viễn thông Bình Định',
        publicTime: '28/05/2025 08:00',
        auctionStartTime: '09/06/2025 09:00:00',
        auctionEndTime: '09/06/2025 10:00:00',
        startPrice: '7,415,000,000 VNĐ',
        deposit: '1,483,000,000 VNĐ',
        registrationFee: '500,000 VNĐ',
        stepPrice: '100,000,000 VNĐ',
        maxBidSteps: '10 bước giá, 30 phút cuối bước giá không giới hạn',
        owner: 'Viễn thông Bình Định - Tập đoàn Bưu chính Viễn thông Việt Nam',
        viewLocation: 'Kho Hoài Nhơn và Kho An Nhơn trực thuộc Viễn thông Bình Định',
        viewDates: 'Các ngày: ngày 02/06/2025, 03/06/2025, 04/06/2025',
        quantity: '55.175 mét cáp đồng các loại và 01 xe ô tô',
        condition: 'Cáp đồng đã qua sử dụng, chất lượng kém, không tái sử dụng được. Xe đã qua sử dụng, hết bình điện, khung gần cũ, rỉ sét, bánh lốp mòn, nội thất sử dụng bình thường, hết hạn kiểm định.',
        location: 'Viễn thông Bình Định, kho Hoài Nhơn và kho An Nhơn, Bình Định',
        legalStatus: 'Tài sản Viễn thông Bình Định quản lý và bán thanh lý theo Quyết định số 622/QĐ-VNPT-BĐH-KTKH ngày 17/4/2025 và Quyết định số 623/QĐ-VNPT-BĐH-KTKH ngày 17/4/2025.',
        auctionInfo: 'Phiên đấu giá trực tuyến, bắt đầu lúc 09/06/2025 09:00:00, kết thúc lúc 09/06/2025 10:00:00.',
        documents: 'Hồ sơ mời tham gia đấu giá, Quyết định thanh lý số 622 và 623.',
        filePurchase: 'Tiền mua hồ sơ: 500,000 VNĐ, thanh toán qua ngân hàng hoặc trực tiếp.',
    };

    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [activeTab, setActiveTab] = useState('description');

    // Hàm tính toán thời gian còn lại
    const calculateTimeLeft = () => {
        const now = new Date();
        const auctionStart = new Date('2025-06-09T09:00:00');
        const difference = auctionStart - now;

        if (difference <= 0) return { hours: 0, minutes: 0, seconds: 0 };

        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        return { hours, minutes, seconds };
    };

    useEffect(() => {
        // Tính toán thời gian ban đầu
        setTimeLeft(calculateTimeLeft());

        // Thiết lập timer để cập nhật mỗi giây
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="asset-detail">
            <div className="content">
                <div className="asset-description">
                    <h1>{asset.title}</h1>
                    <div className="asset-info-section">
                    </div>
                </div>
                <div className="breadcrumb">
                    <span>
                        <Link to="/" style={{ textDecoration: 'none', color: '#666' }}>Trang chủ</Link> / Tài sản đấu giá
                    </span>
                </div>
                <div className="main-content">
                    <div className="left-section">
                        <div className="image-gallery">
                            <div className="main-image">
                                <img src="/path-to-main-image.jpg" alt="Tài sản đấu giá" />
                            </div>
                            <div className="thumbnail-grid">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                    <div key={num} className="thumbnail">
                                        <img src={`/path-to-thumb-${num}.jpg`} alt={`Ảnh ${num}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="right-section">
                        {/* Countdown timer được đặt ở đầu right-section */}
                        <div className="countdown-timer">
                            <div className="time-label">Thời gian đếm ngược bắt đầu trả giá:</div>
                            <div className="timer-display">
                                <div className="time-unit">
                                    <span className="number">{timeLeft.hours.toString().padStart(2, '0')}</span>
                                    <span className="label">GIỜ</span>
                                </div>
                                <div className="time-unit">
                                    <span className="number">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                                    <span className="label">PHÚT</span>
                                </div>
                                <div className="time-unit">
                                    <span className="number">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                                    <span className="label">GIÂY</span>
                                </div>
                            </div>
                        </div>

                        {/* Thông tin chi tiết tài sản */}
                        <div className="asset-info">
                            <div className="info-row">
                                <span className="label">Giá khởi điểm:</span>
                                <span className="value price">{asset.startPrice}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Mã tài sản:</span>
                                <span className="value">{asset.code}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Thời gian mở đăng ký:</span>
                                <span className="value">{asset.publicTime}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Thời gian bắt đầu đấu giá:</span>
                                <span className="value">{asset.auctionStartTime}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Thời gian kết thúc đấu giá:</span>
                                <span className="value">{asset.auctionEndTime}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Phí đăng ký tham gia đấu giá:</span>
                                <span className="value">{asset.registrationFee}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Bước giá:</span>
                                <span className="value">{asset.stepPrice}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Số bước giá tối đa/lần trả:</span>
                                <span className="value">{asset.maxBidSteps}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Tiền đặt trước:</span>
                                <span className="value">{asset.deposit}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Người có tài sản:</span>
                                <span className="value">{asset.owner}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Nơi xem tài sản:</span>
                                <span className="value">{asset.viewLocation}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Thời gian xem tài sản:</span>
                                <span className="value">{asset.viewDates}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="action-buttons">
                    <button className={`action-btn ${activeTab === 'description' ? 'active' : ''}`} onClick={() => handleTabClick('description')}>
                        Mô tả tài sản
                    </button>
                    <button className={`action-btn ${activeTab === 'auction-info' ? 'active' : ''}`} onClick={() => handleTabClick('auction-info')}>
                        Thông tin đấu giá
                    </button>
                    <button className={`action-btn ${activeTab === 'documents' ? 'active' : ''}`} onClick={() => handleTabClick('documents')}>
                        Tài liệu liên quan
                    </button>
                    <button className={`action-btn ${activeTab === 'file-purchase' ? 'active' : ''}`} onClick={() => handleTabClick('file-purchase')}>
                        Tiền mua hồ sơ
                    </button>
                </div>
                <div className="tab-content">
                    {activeTab === 'description' && (
                        <div className="asset-description">
                            <h3>Thông tin mô tả sản phẩm:</h3>
                            <p><strong>Số lượng:</strong> {asset.quantity}</p>
                            <p><strong>Chất lượng:</strong> {asset.condition}</p>
                            <p><strong>Nơi có tài sản:</strong> {asset.location}</p>
                            <p><strong>Trạng thái pháp lý:</strong> {asset.legalStatus}</p>
                        </div>
                    )}
                    {activeTab === 'auction-info' && (
                        <div className="asset-description">
                            <h3>Thông tin đấu giá:</h3>
                            <p>{asset.auctionInfo}</p>
                            <p><strong>Bước giá hiện tại:</strong> 100,000,000 VNĐ</p>
                            <p><strong>Số lần đấu giá:</strong> 5</p>
                            <p><strong>Giá cao nhất:</strong> 100,000,000 VNĐ</p>
                        </div>
                    )}
                    {activeTab === 'documents' && (
                        <div className="asset-description">
                            <h3>Tài liệu liên quan:</h3>
                            <p>{asset.documents}</p>
                        </div>
                    )}
                    {activeTab === 'file-purchase' && (
                        <div className="asset-description">
                            <h3>Tiền mua hồ sơ:</h3>
                            <p>{asset.filePurchase}</p>
                            <p><strong>Tiền đặt trước:</strong> {asset.deposit}</p>
                            <p><strong>Tiền đấu giá:</strong> 1,483,000,000 VNĐ</p>
                        </div>
                    )}
                </div>
                <div className="other-auctions">
                    <h3>Tài sản khác</h3>
                    <div className="auction-grid">
                        {[
                            {
                                title: '15 hạng mục thiết bị nội thất thu hồi được của phòng Khách sạn Bồng Sen',
                                price: '605,451,111 VNĐ',
                            },
                            {
                                title: 'Quyền sử dụng đất và tài sản tại xã Long Hòa, huyện Dầu Tiếng, tỉnh Bình Dương',
                                price: '1,890,000,000 VNĐ',
                            },
                            {
                                title: 'Quyền sử dụng đất và tài sản tại xã Suối Rao, huyện Châu Đức, tỉnh Bà Rịa - Vũng Tàu',
                                price: '6,788,000,000 VNĐ',
                            },
                            {
                                title: 'Quyền sử dụng đất và tài sản tại xã Nghĩa Thành, Huyện Châu Đức, Tỉnh Bà Rịa - Vũng Tàu',
                                price: '2,014,000,000 VNĐ',
                            },
                        ].map((item, index) => (
                            <div key={index} className="auction-card">
                                <div className="auction-image">
                                    <img src="/gavel-icon.png" alt="Auction" />
                                </div>
                                <div className="auction-info">
                                    <p className="auction-title">{item.title}</p>
                                    <p className="auction-price">{item.price}</p>
                                    <button className="view-details-btn">Xem chi tiết</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <footer className="footer">
                    <div className="footer-content">
                        <div className="footer-section">
                            <h4>Công ty đấu giá hợp danh Lạc Việt</h4>
                            <p>Mã số thuế: 0108055420</p>
                            <p>Đại diện: bà Đỗ Thị Hồng Hạnh - Chức vụ: Tổng giám đốc</p>
                            <p>Số giấy đăng ký: 01/TP-ĐKHĐ, Sở tư pháp Hà Nội, 07/08/2017</p>
                            <p>Địa chỉ: Số 49 Văn Cao, phường Liễu Giai, quận Ba Đình, TP. Hà Nội</p>
                            <p>Điện thoại: 024.32.115.234</p>
                            <p>Email: info@lacvietauction.vn</p>
                        </div>
                        <div className="footer-section">
                            <h4>Về chúng tôi</h4>
                            <ul>
                                <li>Giới thiệu</li>
                                <li>Quy chế hoạt động</li>
                                <li>Cơ chế giải quyết tranh chấp</li>
                                <li>Hướng dẫn sử dụng</li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h4>Chính sách</h4>
                            <ul>
                                <li>Câu hỏi thường gặp</li>
                                <li>Cho thuê đấu giá trực tuyến</li>
                                <li>Văn bản pháp quy</li>
                                <li>Chính sách bảo mật</li>
                                <li>Điều khoản sử dụng</li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h4>Tham gia nhận tin</h4>
                            <p>Đăng ký nhận tin qua email</p>
                            <div className="newsletter">
                                <input type="email" placeholder="Nhập Email" />
                                <button>Đăng ký</button>
                            </div>
                            <div className="app-download">
                                <img src="/app-store.png" alt="App Store" />
                                <img src="/google-play.png" alt="Google Play" />
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>Copyright 2024 © Công ty đấu giá hợp danh Lạc Việt</p>
                        <p>Powered by Digital Innovation</p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default AssetDetail;