import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { bidAPI } from '../../services/bid';
import '../../styles/BiddingSection.css';
import { USER_ROLES, AUCTION_STATUS } from "../../utils/constants";

const BiddingSection = () => {
    const { id } = useParams();
    const { user, loading } = useUser();
    const navigate = useNavigate();

    const [sessionDetail, setSessionDetail] = useState(null);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [bidHistory, setBidHistory] = useState([]);
    const [winner, setWinner] = useState(null);
    const [bidAmount, setBidAmount] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState('');
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    // Lấy token (nếu lưu ở localStorage/session)
    const token = user?.token;

    // 1. Load data phiên, giá hiện tại, bid history, winner
    useEffect(() => {
        if (!loading && user && [USER_ROLES.BIDDER, USER_ROLES.ORGANIZER].includes(user.role)) {
            fetchSessionDetail();
            fetchCurrentPrice();
            fetchBidHistory();
            fetchWinner();
        }
    }, [loading, user, id]);

    const fetchSessionDetail = async () => {
        try {
            // Có thể dùng bidAPI hoặc sessionAPI tuỳ cách tách của bạn
            const res = await bidAPI.getSessionById
                ? await bidAPI.getSessionById(id)
                : await bidAPI.getSessionDetail(id);
            setSessionDetail(res);
        } catch (e) {
            setMessage("Không thể tải thông tin phiên đấu giá.");
        }
    };

    const fetchCurrentPrice = async () => {
        try {
            const res = await bidAPI.getCurrentPrice(id);
            setCurrentPrice(res?.data ?? res ?? 0);
        } catch (error) {
            setMessage('Không thể tải giá hiện tại: ' + error.message);
        }
    };

    const fetchBidHistory = async () => {
        try {
            const res = await bidAPI.getBidHistory(id);
            setBidHistory(res?.data ?? res ?? []);
        } catch (error) {
            setMessage('Không thể tải lịch sử trả giá: ' + error.message);
        }
    };

    const fetchWinner = async () => {
        try {
            const res = await bidAPI.getWinner(id);
            setWinner(res?.data ?? res ?? null);
        } catch (error) {
            // Nếu chưa có ai thắng hoặc chưa kết thúc phiên thì không hiện lỗi
        }
    };

    // 2. Countdown thời gian còn lại
    useEffect(() => {
        let interval;
        if (sessionDetail?.endTime || sessionDetail?.end_time) {
            interval = setInterval(() => {
                const now = new Date();
                const end = new Date(sessionDetail.endTime || sessionDetail.end_time);
                const diff = Math.max(0, end - now);
                
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                
                setTimeLeft({ days, hours, minutes, seconds });
                setCountdown(`${minutes} phút ${seconds} giây`);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [sessionDetail]);

    // 3. Đặt giá
    const handleBid = async (e) => {
        e.preventDefault();
        if (!bidAmount || isNaN(bidAmount) || parseFloat(bidAmount) <= currentPrice) {
            setMessage('Giá thầu phải cao hơn giá hiện tại!');
            return;
        }
        setIsLoading(true);
        try {
            await bidAPI.submitBid(id, parseFloat(bidAmount), token);
            setMessage('Đặt giá thành công!');
            setBidAmount('');
            fetchCurrentPrice();
            fetchBidHistory();
        } catch (error) {
            setMessage('Lỗi khi đặt giá: ' + (error?.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    // 4. Organizer kết thúc phiên
    const handleEndSession = async () => {
        if (!window.confirm("Bạn chắc chắn muốn kết thúc phiên đấu giá này?")) return;
        setIsLoading(true);
        try {
            await bidAPI.closeSession(id, token);
            setMessage("Đã kết thúc phiên đấu giá!");
            fetchSessionDetail();
            fetchWinner();
        } catch (error) {
            setMessage("Lỗi khi kết thúc phiên: " + (error?.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    if (loading) return <div className="loading">Đang tải...</div>;
    if (!user || ![USER_ROLES.BIDDER, USER_ROLES.ORGANIZER].includes(user.role)) {
        return <div className="access-denied">Bạn không có quyền truy cập.</div>;
    }

    // Asset info (tuỳ theo API trả về)
    const asset = sessionDetail?.asset || sessionDetail?.document || {};
    const imageUrl =
        (asset.image_urls && asset.image_urls[0]) ||
        asset.imageUrl ||
        asset.thumbnailUrl ||
        '/images/past-auction-default.jpg';

    // Xác định trạng thái phiên (ACTIVE, FINISHED...)
    const status = sessionDetail?.status || sessionDetail?.sessionStatus || sessionDetail?.statusText || '';

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    return (
        <div className="new-auction-container">
            {/* Header */}
            {/* Main Content */}
            <div className="new-auction-content">
                {/* Left Section */}
                <div className="left-section">
                    {/* Timer */}
                    <div className="timer-section">
                        <h3 className="timer-title">Thời gian còn lại để trả giá:</h3>
                        <div className="countdown-display">
                            <div className="time-unit">
                                <div className="time-value">{timeLeft.days}</div>
                                <div className="time-label">NGÀY</div>
                            </div>
                            <div className="time-unit">
                                <div className="time-value">{timeLeft.hours}</div>
                                <div className="time-label">GIỜ</div>
                            </div>
                            <div className="time-unit">
                                <div className="time-value">{timeLeft.minutes}</div>
                                <div className="time-label">PHÚT</div>
                            </div>
                            <div className="time-unit">
                                <div className="time-value">{timeLeft.seconds}</div>
                                <div className="time-label">GIÂY</div>
                            </div>
                        </div>
                    </div>

                    {/* Asset Information */}
                    <div className="asset-info-section">
                        <div className="info-grid">
                            <div className="info-row">
                                <span className="info-label">Mã tài sản:</span>
                                <span className="info-value highlight">MTS-1001219</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Bước giá:</span>
                                <span className="info-value">300.000 VNĐ/m²</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Số bước giá tối đa/ lần trả:</span>
                                <span className="info-value highlight">10 bước giá</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Tiền đặt trước:</span>
                                <span className="info-value">350.000.000 VNĐ</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Giá khởi điểm:</span>
                                <span className="info-value">35.000.000 VNĐ/m²</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Phương thức đấu giá:</span>
                                <span className="info-value highlight">Trả giá lên và liên tục</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Tổ chức đấu giá tài sản:</span>
                                <span className="info-value">Công ty đấu giá hợp danh Lạc Việt</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Đại giá viên:</span>
                                <span className="info-value">Đỗ Thị Hồng Hạnh</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Thời gian bắt đầu trả giá:</span>
                                <span className="info-value">05/07/2021 13:00:00</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Thời gian kết thúc trả giá:</span>
                                <span className="info-value highlight">05/07/2021 13:25:00</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Mã đấu giá của ban:</span>
                                <span className="info-value">MKH-4DBSTH</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Giá cao nhất của ban:</span>
                                <span className="info-value">0 VNĐ/m²</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Đại giá(VNĐ/m²):</span>
                                <span className="info-value"></span>
                            </div>
                        </div>
                    </div>

                    {/* Product Image */}
                    <div className="image-section">
                        <h3>HÌNH ẢNH SẢN PHẨM ĐẤU GIÁ</h3>
                        <div className="image-container">
                            <img
                                src={imageUrl}
                                alt="Sản phẩm đấu giá"
                                className="product-image"
                                onError={(e) => {
                                    e.currentTarget.src = '/images/past-auction-default.jpg';
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="right-section">
                    {/* Bidding Progress */}
                    <div className="bidding-progress-section">
                        <h3 className="section-title">DIỄN BIẾN PHIÊN ĐẤU GIÁ</h3>
                        
                        <div className="bidding-slots">
                            {[1, 2, 3].map((slot) => (
                                <div key={slot} className="bidding-slot">
                                    <div className="slot-title">SỐ TIỀN ĐẤU GIÁ {slot}</div>
                                    <div className="slot-content">
                                        {bidHistory[slot - 1] ? 
                                            `${formatPrice(bidHistory[slot - 1].price)} VNĐ - ${bidHistory[slot - 1].fullName}` :
                                            `Chờ trả giá và người đấu giá ${slot}`
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Current Price Display */}
                        <div className="current-price-container">
                            <div className="price-arrows">
                                <div className="arrow-up">↑</div>
                                <div className="price-display">
                                    <div className="price-main">{formatPrice(currentPrice)}</div>
                                    <div className="price-subtitle">Bạn muốn tăm trệu đó tham nghiêm động</div>
                                </div>
                                <div className="arrow-down">↓</div>
                            </div>
                            
                            <div className="highest-price">
                                Giá cao nhất hiện tại: <span className="price-highlight">{formatPrice(currentPrice)} VNĐ/m²</span>
                            </div>
                        </div>

                        {/* Bidding Controls */}
                        <div className="bidding-controls">
                            <div className="red-button">Đặt mức giá cao hơn mức giá cao nhất</div>
                        </div>
                    </div>

                    {/* Auction Details */}
                    <div className="auction-details-section">
                        <div className="details-row">
                            <span>MỨC GIÁ HIỆN TẠI:</span>
                            <span>Giá cao nhất theo đấu giá:</span>
                        </div>
                        
                        {/* Winner info nếu đã có */}
                        {status === AUCTION_STATUS.FINISHED && winner && (
                            <div className="winner-section">
                                <h4>Người thắng phiên</h4>
                                <div>
                                    <b>{winner.fullName}</b> với giá <b>{formatPrice(winner.price)} VNĐ</b>
                                </div>
                            </div>
                        )}

                        {/* BIDDER: form đặt giá */}
                        {user.role === USER_ROLES.BIDDER && status === AUCTION_STATUS.ACTIVE && (
                            <div className="bid-form-section">
                                {message && (
                                    <div className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>
                                        {message}
                                    </div>
                                )}
                                
                                <div className="bid-form-controls">
                                    <div className="step-controls">
                                        <span className="step-label">BƯỚC GIÁ</span>
                                        <button className="step-btn">×</button>
                                        <select className="step-select">
                                            <option>number</option>
                                        </select>
                                        <button className="step-btn">+</button>
                                    </div>
                                    
                                    <input
                                        type="number"
                                        value={bidAmount}
                                        onChange={(e) => setBidAmount(e.target.value)}
                                        placeholder="Số tiền đấu giá"
                                        className="bid-input"
                                        disabled={isLoading}
                                    />
                                    
                                    <button 
                                        onClick={handleBid}
                                        className="bid-submit-btn"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'ĐANG XỬ LÝ...' : 'TRẢ GIÁ'}
                                    </button>
                                </div>
                                
                                <div className="bid-note">
                                    Số tiền này được đặt theo cách đấu giá trả lên
                                </div>
                            </div>
                        )}

                        {/* ORGANIZER: nút kết thúc phiên */}
                        {user.role === USER_ROLES.ORGANIZER &&
                            sessionDetail?.organizerId === user.id &&
                            status === AUCTION_STATUS.ACTIVE && (
                                <button className="end-session-btn" onClick={handleEndSession} disabled={isLoading}>
                                    {isLoading ? "ĐANG XỬ LÝ..." : "Kết thúc phiên đấu giá"}
                                </button>
                            )}
                    </div>

                    {/* Other Auctions */}
                    <div className="other-auctions-section">
                        <h3 className="section-title">CÁC PHIÊN ĐẤU GIÁ KHÁC ĐANG DIỄN RA</h3>
                        <div className="other-auctions-grid">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <div key={item} className="other-auction-item">
                                    <div className="auction-placeholder">Phiên {item}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Back Button */}
                    <button onClick={() => navigate(-1)} className="back-button">
                        ← Quay lại
                    </button>
                </div>
            </div>
        </div>
    );
}
export default BiddingSection;