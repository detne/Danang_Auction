// src/components/common/BiddingSection.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { bidAPI } from '../../services/bid';
import '../../styles/BiddingSection.css';
import { USER_ROLES } from '../../utils/constants';

const BiddingSection = () => {
    const { id: sessionId } = useParams();
    const { user, loading, token } = useUser();
    const navigate = useNavigate();

    const [currentPrice, setCurrentPrice] = useState(0);
    const [bidHistory, setBidHistory] = useState([]);
    const [bidAmount, setBidAmount] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Lấy giá hiện tại
    const fetchCurrentPrice = async () => {
        try {
            const res = await bidAPI.getCurrentPrice(sessionId);
            // res.data là số, có thể là BigDecimal, xử lý về Number
            setCurrentPrice(Number(res.data) || 0);
        } catch (error) {
            setMessage('Không thể tải giá hiện tại: ' + (error?.response?.data?.message || error.message));
        }
    };

    // Lấy lịch sử đấu giá (hoặc danh sách người tham gia)
    const fetchBidHistory = async () => {
        try {
            const res = await bidAPI.getParticipants(sessionId, token);
            // res.data là mảng các participant hoặc bid, tùy backend
            // map lại dữ liệu nếu cần (ví dụ: lấy các trường amount, bidderName)
            setBidHistory(res.data || []);
        } catch (error) {
            setMessage('Không thể tải lịch sử trả giá: ' + (error?.response?.data?.message || error.message));
        }
    };

    useEffect(() => {
        if (!loading && (!user || user.role !== USER_ROLES.BIDDER)) {
            navigate('/');
        } else if (!loading && user) {
            fetchCurrentPrice();
            fetchBidHistory();
        }
        // eslint-disable-next-line
    }, [loading, user, sessionId, navigate]);

    // Xử lý đặt giá
    const handleBid = async (e) => {
        e.preventDefault();
        if (!bidAmount || isNaN(bidAmount) || parseFloat(bidAmount) <= currentPrice) {
            setMessage('Giá thầu phải cao hơn giá hiện tại!');
            return;
        }

        setIsLoading(true);
        try {
            await bidAPI.submitBid(sessionId, parseFloat(bidAmount), token);
            setMessage('Đặt giá thành công!');
            setBidAmount('');
            await fetchCurrentPrice();
            await fetchBidHistory();
        } catch (error) {
            setMessage('Lỗi khi đặt giá: ' + (error?.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    if (loading) return <div>Đang tải...</div>;
    if (!user || user.role !== USER_ROLES.BIDDER) return <div>Bạn không có quyền truy cập.</div>;

    return (
        <div className="auction-container">
            <div className="auction-header">
                <h1>TIÊU ĐỀ TÀI SẢN ĐẤU GIÁ</h1>
            </div>

            <div className="auction-content">
                <div className="auction-left">
                    <div className="auction-timer">
                        <span className="timer-label">THỜI GIAN CÒN LẠI</span>
                        <div className="timer-display">
                            <span>PHÚT</span>
                            <span>GIÂY</span>
                        </div>
                    </div>

                    <div className="auction-image">
                        <img
                            src="/api/placeholder/600/400"
                            alt="Sản phẩm đấu giá"
                            className="product-image"
                        />
                    </div>
                </div>

                <div className="auction-right">
                    <div className="auction-sidebar">
                        <div className="auction-sessions">
                            <h3>DIỄN BIẾN PHIÊN ĐẤU GIÁ</h3>
                            <div className="session-list">
                                {bidHistory.map((item, index) => (
                                    <div key={index} className="session-item">
                                        <span>
                                            {(item.amount ?? item.price ?? 0).toLocaleString()} VNĐ
                                        </span>
                                        <span className="session-info">
                                            {item.bidderName || item.fullName || item.username || 'Người đấu giá'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="current-price-section">
                            <div className="price-label">MỨC GIÁ HIỆN TẠI:</div>
                            <div className="current-price-display">
                                * Giá Hiện Tại Phiên Đấu Giá *
                                <div className="price-amount">{currentPrice.toLocaleString()} VNĐ</div>
                            </div>
                        </div>

                        <div className="bidding-section">
                            {message && (
                                <div className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleBid} className="bid-form">
                                <input
                                    type="number"
                                    value={bidAmount}
                                    onChange={(e) => setBidAmount(e.target.value)}
                                    placeholder="Nhập giá thầu"
                                    className="bid-input"
                                    required
                                    min={currentPrice + 1}
                                    disabled={isLoading}
                                />
                                <button type="submit" className="bid-button" disabled={isLoading}>
                                    {isLoading ? 'ĐANG XỬ LÝ...' : 'TRA GIÁ'}
                                </button>
                            </form>

                            <div className="bid-info">
                                Số tiền này sẽ được ghi vào sổ đấu giá
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BiddingSection;
