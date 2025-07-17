import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { getCurrentPrice, getBidHistory, placeBid } from '../services/api';
import '../styles/BiddingSection.css';

const BiddingSection = () => {
    const { id } = useParams(); // Lấy sessionId từ URL
    const { user, loading } = useUser();
    const navigate = useNavigate();
    const [currentPrice, setCurrentPrice] = useState(0);
    const [bidHistory, setBidHistory] = useState([]);
    const [bidAmount, setBidAmount] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!loading && user && user.role !== 'BIDDER') {
            navigate('/');
        } else if (!loading && user) {
            fetchCurrentPrice();
            fetchBidHistory();
        }
    }, [loading, user, id, navigate]);

    const fetchCurrentPrice = async () => {
        try {
            const response = await getCurrentPrice(id);
            if (response.success) {
                setCurrentPrice(response.data || 0); // Ánh xạ từ API
            } else {
                setMessage('Không thể tải giá hiện tại: ' + response.message);
            }
        } catch (error) {
            setMessage('Lỗi khi tải giá hiện tại: ' + error.message);
        }
    };

    const fetchBidHistory = async () => {
        try {
            const response = await getBidHistory(id);
            if (response.success) {
                setBidHistory(response.data.map(bid => ({
                    amount: bid.price || 0, // Sử dụng 'price' từ AuctionBid
                    timestamp: bid.timestamp,
                })) || []);
            } else {
                setMessage('Không thể tải lịch sử trả giá: ' + response.message);
            }
        } catch (error) {
            setMessage('Lỗi khi tải lịch sử trả giá: ' + error.message);
        }
    };

    const handleBid = async (e) => {
        e.preventDefault();
        if (!bidAmount || isNaN(bidAmount) || parseFloat(bidAmount) <= currentPrice) {
            setMessage('Giá thầu phải cao hơn giá hiện tại!');
            return;
        }

        try {
            const response = await placeBid(id, {
                amount: parseFloat(bidAmount), // Chuyển sang Double
                userId: user.id,
            });
            if (response.success) {
                setMessage('Đặt giá thành công!');
                setBidAmount('');
                fetchCurrentPrice();
                fetchBidHistory();
            } else {
                setMessage('Lỗi khi đặt giá: ' + response.message);
            }
        } catch (error) {
            setMessage('Lỗi khi đặt giá: ' + error.message);
        }
    };

    if (loading) return <div>Đang tải...</div>;
    if (!user || user.role !== 'BIDDER') return <div>Bạn không có quyền truy cập.</div>;

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
                                <div className="session-item active">
                                    <span>SỐ TIỀN ĐẤU GIÁ 1</span>
                                    <span className="session-info">THÔNG TIN NGƯỜI ĐẤU GIÁ 1</span>
                                </div>
                                <div className="session-item">
                                    <span>SỐ TIỀN ĐẤU GIÁ 2</span>
                                    <span className="session-info">THÔNG TIN NGƯỜI ĐẤU GIÁ 2</span>
                                </div>
                                <div className="session-item">
                                    <span>SỐ TIỀN ĐẤU GIÁ 3</span>
                                    <span className="session-info">THÔNG TIN NGƯỜI ĐẤU GIÁ 3</span>
                                </div>
                                <div className="session-item">
                                    <span>SỐ TIỀN ĐẤU GIÁ N</span>
                                    <span className="session-info">THÔNG TIN NGƯỜI ĐẤU GIÁ N</span>
                                </div>
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
                            <div className="bid-step">
                                <span>BƯỚC GIÁ</span>
                                <div className="step-controls">
                                    <button type="button" className="step-btn">×</button>
                                    <input type="number" className="step-input" placeholder="number" />
                                    <button type="button" className="step-btn">+</button>
                                </div>
                                <span className="currency-label">SỐ TIỀN<br />ĐẤU GIÁ</span>
                            </div>

                            {message && <div className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>{message}</div>}

                            <form onSubmit={handleBid} className="bid-form">
                                <input
                                    type="number"
                                    value={bidAmount}
                                    onChange={(e) => setBidAmount(e.target.value)}
                                    placeholder="Nhập giá thầu"
                                    className="bid-input"
                                    required
                                />
                                <button type="submit" className="bid-button">
                                    TRA GIÁ "SỐ TIỀN ĐẤU GIÁ"
                                </button>
                            </form>

                            <div className="bid-info">
                                Số tiền này sẽ được ghi vào sổ đấu giá
                            </div>
                        </div>

                        <div className="bid-history-section">
                            <h3>Lịch sử trả giá</h3>
                            <div className="history-table">
                                <div className="history-header">
                                    <span>Giá thầu</span>
                                    <span>Thời gian</span>
                                </div>
                                <div className="history-body">
                                    {bidHistory.length > 0 ? (
                                        bidHistory.map((bid, index) => (
                                            <div key={index} className="history-row">
                                                <span>{bid.amount.toLocaleString()} VNĐ</span>
                                                <span>{new Date(bid.timestamp).toLocaleString()}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="history-row">
                                            <span colSpan="2">Chưa có lượt trả giá.</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BiddingSection;