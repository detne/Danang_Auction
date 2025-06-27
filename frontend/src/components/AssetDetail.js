import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import '../styles/AssetDetail.css';

const AssetDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();

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
    const [auctionStarted, setAuctionStarted] = useState(false);

    const calculateTimeLeft = () => {
        const now = new Date();
        const auctionStart = new Date('2025-06-09T09:00:00');
        const difference = auctionStart - now;

        if (difference <= 0) {
            setAuctionStarted(true);
            return { hours: 0, minutes: 0, seconds: 0 };
        }

        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        return { hours, minutes, seconds };
    };

    useEffect(() => {
        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleAuctionClick = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (user.role !== 'BIDDER') {
            alert('Bạn cần có quyền đấu giá để tham gia phiên này.');
            return;
        }
        navigate(`/sessions/${id}/bid`);
    };

    const renderCountdownOrButton = () => {
        if (auctionStarted) {
            return (
                <div className="auction-status-container">
                    <div className="auction-status-text">Phiên đấu giá đã bắt đầu!</div>
                    <button className="auction-btn" onClick={handleAuctionClick}>
                        Tham gia đấu giá
                    </button>
                </div>
            );
        } else {
            return (
                <div className="countdown-section">
                    <div className="countdown-title">Thời gian đếm ngược bắt đầu trả giá:</div>
                    <div className="countdown-display">
                        <div className="countdown-item">
                            <div className="countdown-number">{timeLeft.hours.toString().padStart(2, '0')}</div>
                            <div className="countdown-label">GIỜ</div>
                        </div>
                        <div className="countdown-item">
                            <div className="countdown-number">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                            <div className="countdown-label">PHÚT</div>
                        </div>
                        <div className="countdown-item">
                            <div className="countdown-number">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                            <div className="countdown-label">GIÂY</div>
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="asset-detail">
            <div className="content">
                <div className="header-section">
                    <h1 className="asset-title">{asset.title}</h1>
                    <div className="breadcrumb">
                        <Link to="/" className="breadcrumb-link">Trang chủ</Link>
                        <span className="breadcrumb-separator"> / </span>
                        <span className="breadcrumb-current">Tài sản đấu giá</span>
                    </div>
                </div>

                <div className="main-layout">
                    <div className="left-column">
                        <div className="image-section">
                            <div className="main-image">
                                <img src="/path-to-main-image.jpg" alt="Tài sản đấu giá" />
                            </div>
                            <div className="thumbnail-list">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                    <div key={num} className="thumbnail-item">
                                        <img src={`/path-to-thumb-${num}.jpg`} alt={`Ảnh ${num}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="right-column">
                        {renderCountdownOrButton()}

                        <div className="asset-details">
                            <div className="detail-item">
                                <span className="detail-label">Giá khởi điểm:</span>
                                <span className="detail-value price-value">{asset.startPrice}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Mã tài sản:</span>
                                <span className="detail-value">{asset.code}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Thời gian mở đăng ký:</span>
                                <span className="detail-value">{asset.publicTime}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Thời gian bắt đầu đấu giá:</span>
                                <span className="detail-value">{asset.auctionStartTime}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Thời gian kết thúc đấu giá:</span>
                                <span className="detail-value">{asset.auctionEndTime}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Phí đăng ký tham gia đấu giá:</span>
                                <span className="detail-value">{asset.registrationFee}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Bước giá:</span>
                                <span className="detail-value">{asset.stepPrice}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Số bước giá tối đa/lần trả:</span>
                                <span className="detail-value">{asset.maxBidSteps}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Tiền đặt trước:</span>
                                <span className="detail-value">{asset.deposit}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Người có tài sản:</span>
                                <span className="detail-value">{asset.owner}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Nơi xem tài sản:</span>
                                <span className="detail-value">{asset.viewLocation}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Thời gian xem tài sản:</span>
                                <span className="detail-value">{asset.viewDates}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="tab-section">
                    <div className="tab-buttons">
                        <button
                            className={`tab-button ${activeTab === 'description' ? 'active' : ''}`}
                            onClick={() => handleTabClick('description')}
                        >
                            Mô tả tài sản
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'auction-info' ? 'active' : ''}`}
                            onClick={() => handleTabClick('auction-info')}
                        >
                            Thông tin đấu giá
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'documents' ? 'active' : ''}`}
                            onClick={() => handleTabClick('documents')}
                        >
                            Tài liệu liên quan
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'file-purchase' ? 'active' : ''}`}
                            onClick={() => handleTabClick('file-purchase')}
                        >
                            Tiền mua hồ sơ
                        </button>
                    </div>

                    <div className="tab-content">
                        {activeTab === 'description' && (
                            <div className="tab-panel">
                                <h3>Thông tin mô tả sản phẩm:</h3>
                                <p><strong>Số lượng:</strong> {asset.quantity}</p>
                                <p><strong>Chất lượng:</strong> {asset.condition}</p>
                                <p><strong>Nơi có tài sản:</strong> {asset.location}</p>
                                <p><strong>Trạng thái pháp lý:</strong> {asset.legalStatus}</p>
                            </div>
                        )}
                        {activeTab === 'auction-info' && (
                            <div className="tab-panel">
                                <h3>Thông tin đấu giá:</h3>
                                <p>{asset.auctionInfo}</p>
                                <p><strong>Bước giá hiện tại:</strong> 100,000,000 VNĐ</p>
                                <p><strong>Số lần đấu giá:</strong> 5</p>
                                <p><strong>Giá cao nhất:</strong> 100,000,000 VNĐ</p>
                            </div>
                        )}
                        {activeTab === 'documents' && (
                            <div className="tab-panel">
                                <h3>Tài liệu liên quan:</h3>
                                <p>{asset.documents}</p>
                            </div>
                        )}
                        {activeTab === 'file-purchase' && (
                            <div className="tab-panel">
                                <h3>Tiền mua hồ sơ:</h3>
                                <p>{asset.filePurchase}</p>
                                <p><strong>Tiền đặt trước:</strong> {asset.deposit}</p>
                                <p><strong>Tiền đấu giá:</strong> 1,483,000,000 VNĐ</p>
                            </div>
                        )}
                    </div>
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
            </div>
        </div>
    );
};

export default AssetDetail;