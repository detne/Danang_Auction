// src/components/AssetDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { assetAPI } from '../../services/asset';
import { formatDate } from '../../utils/formatDate';
import '../../styles/AssetDetail.css';

const AssetDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();

    const [asset, setAsset] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [activeTab, setActiveTab] = useState('description');
    const [auctionStarted, setAuctionStarted] = useState(false);
    const [auctionEnded, setAuctionEnded] = useState(false);

    useEffect(() => {
        const fetchAssetData = async () => {
            try {
                setLoading(true);
                const response = await assetAPI.getAssetById(id);
                if (response.success) {
                    setAsset(response.data);
                    console.log('Asset data:', response.data); // Debug
                } else {
                    setError(response.message || 'Không thể tải thông tin tài sản');
                }
            } catch (err) {
                console.error('Error fetching asset:', err);
                setError(err.message || 'Lỗi khi tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchAssetData();
    }, [id]);

    const calculateTimeLeft = () => {
        if (!asset?.auctionStartTime || !asset?.auctionEndTime) return { hours: 0, minutes: 0, seconds: 0 };

        const now = new Date();
        const auctionStart = new Date(asset.auctionStartTime);
        const auctionEnd = new Date(asset.auctionEndTime);
        const diffStart = auctionStart - now;
        const diffEnd = auctionEnd - now;

        if (diffEnd <= 0) {
            setAuctionEnded(true);
            setAuctionStarted(false);
            return { hours: 0, minutes: 0, seconds: 0 };
        }
        if (diffStart <= 0) {
            setAuctionStarted(true);
            return { hours: 0, minutes: 0, seconds: 0 };
        }
        setAuctionStarted(false);
        setAuctionEnded(false);

        const hours = Math.floor(diffStart / (1000 * 60 * 60));
        const minutes = Math.floor((diffStart % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffStart % (1000 * 60)) / 1000);

        return { hours, minutes, seconds };
    };

    useEffect(() => {
        if (asset) {
            setTimeLeft(calculateTimeLeft());
            const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
            return () => clearInterval(timer);
        }
    }, [asset]);

    const handleTabClick = (tab) => setActiveTab(tab);
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
        if (auctionEnded) {
            return (
                <div className="auction-status-container">
                    <div className="auction-status-text">Phiên đấu giá đã kết thúc!</div>
                </div>
            );
        } else if (auctionStarted) {
            return (
                <div className="auction-status-container">
                    <div className="auction-status-text">Phiên đấu giá đang diễn ra!</div>
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

    const formatCurrency = (amount) => (amount == null ? '--' : new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ');

    if (loading) return <div className="asset-detail"><div className="content"><div className="loading-container"><div className="loading-spinner"></div><p>Đang tải thông tin tài sản...</p></div></div></div>;
    if (error) return <div className="asset-detail"><div className="content"><div className="error-container"><h2>Lỗi</h2><p>{error}</p><button onClick={() => window.location.reload()}>Thử lại</button></div></div></div>;
    if (!asset) return <div className="asset-detail"><div className="content"><div className="not-found-container"><h2>Không tìm thấy tài sản</h2><p>Tài sản với ID {id} không tồn tại.</p><Link to="/" className="back-home-btn">Về trang chủ</Link></div></div></div>;

    return (
        <div className="asset-detail">
            <div className="content">
                <div className="header-section">
                    <h1 className="asset-title">{asset.name || asset.title || asset.description}</h1>
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
                                <img
                                    src={asset.images?.[0]?.url || "/path-to-main-image.jpg"}
                                    alt={asset.name || "Tài sản đấu giá"}
                                />
                            </div>
                            <div className="thumbnail-list">
                                {asset.images?.map((image, index) => (
                                    <div key={image.id || index} className="thumbnail-item">
                                        <img src={image.url} alt={`Ảnh ${index + 1}`} />
                                    </div>
                                )) || [1, 2, 3].map((num) => (
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
                                <span className="detail-value price-value">{formatCurrency(asset.startingPrice)}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Mã tài sản:</span>
                                <span className="detail-value">{asset.documentCode || `MTS-${asset.id}`}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Thời gian mở đăng ký:</span>
                                <span className="detail-value">{formatDate(asset.publicTime) || '--'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Thời gian bắt đầu đấu giá:</span>
                                <span className="detail-value">{formatDate(asset.auctionStartTime) || '--'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Thời gian kết thúc đấu giá:</span>
                                <span className="detail-value">{formatDate(asset.auctionEndTime) || '--'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Phí đăng ký tham gia đấu giá:</span>
                                <span className="detail-value">{formatCurrency(asset.registrationFee)}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Bước giá:</span>
                                <span className="detail-value">{formatCurrency(asset.stepPrice)}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Số bước giá tối đa/lần trả:</span>
                                <span className="detail-value">{asset.maxBidSteps || 'Không giới hạn'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Tiền đặt trước:</span>
                                <span className="detail-value">{formatCurrency(asset.depositAmount)}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Người có tài sản:</span>
                                <span className="detail-value">{asset.owner || asset.organizerName || '--'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Nơi xem tài sản:</span>
                                <span className="detail-value">{asset.viewLocation || asset.location || '--'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Thời gian xem tài sản:</span>
                                <span className="detail-value">{asset.viewDates || 'Liên hệ để xem'}</span>
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
                                <p><strong>Mô tả:</strong> {asset.description || 'Chưa có mô tả'}</p>
                                <p><strong>Số lượng:</strong> {asset.quantity || 'Chưa xác định'}</p>
                                <p><strong>Chất lượng:</strong> {asset.condition || 'Chưa xác định'}</p>
                                <p><strong>Nơi có tài sản:</strong> {asset.location || 'Chưa xác định'}</p>
                                <p><strong>Trạng thái pháp lý:</strong> {asset.legalStatus || 'Chưa xác định'}</p>
                            </div>
                        )}
                        {activeTab === 'auction-info' && (
                            <div className="tab-panel">
                                <h3>Thông tin đấu giá:</h3>
                                <p><strong>Trạng thái:</strong> {asset.status || 'Chưa xác định'}</p>
                                <p><strong>Giá khởi điểm:</strong> {formatCurrency(asset.startingPrice)}</p>
                                <p><strong>Bước giá:</strong> {formatCurrency(asset.stepPrice)}</p>
                                <p><strong>Tiền đặt trước:</strong> {formatCurrency(asset.depositAmount)}</p>
                                <p><strong>Phí đăng ký:</strong> {formatCurrency(asset.registrationFee)}</p>
                                <p><strong>Giá cao nhất hiện tại:</strong> {formatCurrency(asset.currentHighestBid || asset.startingPrice)}</p>
                            </div>
                        )}
                        {activeTab === 'documents' && (
                            <div className="tab-panel">
                                <h3>Tài liệu liên quan:</h3>
                                <p>{asset.documents || 'Chưa có tài liệu đính kèm'}</p>
                                {asset.documentUrls && asset.documentUrls.length > 0 && (
                                    <div className="document-links">
                                        {asset.documentUrls.map((doc, index) => (
                                            <a key={index} href={doc.url} target="_blank" rel="noopener noreferrer">
                                                {doc.name || `Tài liệu ${index + 1}`}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === 'file-purchase' && (
                            <div className="tab-panel">
                                <h3>Tiền mua hồ sơ:</h3>
                                <p><strong>Phí mua hồ sơ:</strong> {formatCurrency(asset.filePurchaseFee)}</p>
                                <p><strong>Tiền đặt trước:</strong> {formatCurrency(asset.depositAmount)}</p>
                                <p><strong>Phí đăng ký tham gia:</strong> {formatCurrency(asset.registrationFee)}</p>
                                <p>{asset.filePurchase || 'Thông tin thanh toán sẽ được cung cấp sau khi đăng ký'}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="other-auctions">
                    <h3>Tài sản khác</h3>
                    <div className="auction-grid">
                        <div className="auction-card">
                            <div className="auction-image">
                                <img src="/gavel-icon.png" alt="Auction" />
                            </div>
                            <div className="auction-info">
                                <p className="auction-title">Tải thêm tài sản khác...</p>
                                <p className="auction-price">Đang cập nhật</p>
                                <Link to="/" className="view-details-btn">Xem tất cả</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssetDetail;