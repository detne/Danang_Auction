import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { bidAPI } from '../../services/bid';
import { USER_ROLES, AUCTION_STATUS } from "../../utils/constants";
import { formatCurrency } from '../../utils/formatCurrency';

const DEFAULT_IMG = "/images/past-auction-default.jpg";

const formatDate = (str) => {
    if (!str) return "--";
    const date = new Date(str);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
};

const BiddingSection = () => {
    const { id } = useParams();
    const { user, loading } = useUser();
    const navigate = useNavigate();

    const [sessionDetail, setSessionDetail] = useState(null);
    const [sessionId, setSessionId] = useState(id || null);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [bidHistory, setBidHistory] = useState([]);
    const [winner, setWinner] = useState(null);
    const [bidAmount, setBidAmount] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [mainImage, setMainImage] = useState(DEFAULT_IMG);
    const [hasSetMainImage, setHasSetMainImage] = useState(false);

    const token = user?.token;

    // 1. Thêm useEffect để xóa message sau một thời gian với cleanup
    useEffect(() => {
        let timer;
        if (message && message.includes('thành công')) {
            timer = setTimeout(() => {
                setMessage('');
            }, 3000);
        }
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [message]);

    // Fetch session detail theo id hoặc code
    useEffect(() => {
        if (!loading && user && [USER_ROLES.BIDDER, USER_ROLES.ORGANIZER].includes(user.role)) {
            if (id) fetchSessionDetailById(id);
        }
    }, [loading, user, id]);

    // Khi có sessionId (lấy từ fetchDetail), mới fetch các API phụ thuộc sessionId
    useEffect(() => {
        if (id) {
            fetchCurrentPrice(id);
            fetchBidHistory(id);
            fetchWinner(id);
        }
    }, [id]);

    useEffect(() => {
        if (sessionDetail) {
            console.log("== sessionDetail ==", sessionDetail);
            console.log("== asset ==", sessionDetail.asset);
        }
    }, [sessionDetail]);

    // Set main image
    useEffect(() => {
        if (!hasSetMainImage && sessionDetail) {
            const asset = sessionDetail?.asset || sessionDetail?.document || {};
            const images = asset.image_urls || asset.imageUrls || [];
            setMainImage(images.length > 0 ? images[0] : DEFAULT_IMG);
            setHasSetMainImage(true);
        }
    }, [sessionDetail, hasSetMainImage]);

    // --- API fetch function ---
    const fetchSessionDetailById = async (id) => {
        try {
            const res = await bidAPI.getSessionById(id);
            setSessionDetail(res.data ?? res);
            setSessionId(res.data?.id ?? res.id ?? id);
        } catch (e) {
            setMessage("Không thể tải thông tin phiên đấu giá.");
        }
    };

    const fetchCurrentPrice = async (sessionIdParam) => {
        try {
            const res = await bidAPI.getCurrentPrice(sessionIdParam);
            setCurrentPrice(res?.data ?? res ?? 0);
        } catch (error) {
            setMessage('Không thể tải giá hiện tại: ' + error.message);
        }
    };

    const fetchBidHistory = async (sessionIdParam) => {
        try {
            const res = await bidAPI.getBidHistory(sessionIdParam);
            setBidHistory(res?.data ?? res ?? []);
        } catch (error) {
            setMessage('Không thể tải lịch sử trả giá: ' + error.message);
        }
    };

    // 2. Cải tiến hàm fetchWinner để không hiển thị lỗi khi chưa có winner
    const fetchWinner = async (sessionIdParam) => {
        try {
            const res = await bidAPI.getWinner(sessionIdParam);
            setWinner(res?.data ?? res ?? null);
        } catch (error) {
            // Chỉ hiển thị lỗi nếu không phải lỗi 404 (chưa có winner)
            if (error?.response?.status !== 404) {
                console.warn('Error fetching winner:', error.message);
            }
            setWinner(null);
        }
    };

    // Countdown timer với cleanup tốt hơn
    useEffect(() => {
        let interval;
        if (sessionDetail) {
            const start = new Date(sessionDetail.startTime || sessionDetail.start_time);
            const end = new Date(sessionDetail.endTime || sessionDetail.end_time);
            
            const updateTimer = () => {
                const current = new Date();
                let diff;
                if (current < start) {
                    diff = Math.max(0, start - current);
                } else {
                    diff = Math.max(0, end - current);
                }
                
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                setTimeLeft({ days, hours, minutes, seconds });
                
                // Dừng timer khi hết thời gian
                if (diff <= 0) {
                    clearInterval(interval);
                }
            };
            
            // Gọi ngay lập tức và sau đó mỗi giây
            updateTimer();
            interval = setInterval(updateTimer, 1000);
        }
        
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [sessionDetail]);

    // Bid handling
    // 3. Thêm validation tốt hơn cho bid amount
    const handleBid = async (e) => {
        e.preventDefault();

        // Xóa message cũ ngay khi bắt đầu
        setMessage('');

        // Validation chi tiết hơn
        const bidValue = parseFloat(bidAmount);
        const stepPrice = sessionDetail?.asset?.step_price || sessionDetail?.asset?.stepPrice || 0;

        if (!bidAmount || isNaN(bidValue)) {
            setMessage('Vui lòng nhập số tiền hợp lệ!');
            return;
        }

        if (bidValue <= currentPrice) {
            setMessage('Giá thầu phải cao hơn giá hiện tại!');
            return;
        }

        // Kiểm tra bước giá nếu có
        if (stepPrice > 0 && (bidValue - currentPrice) < stepPrice) {
            setMessage(`Bước giá tối thiểu là ${formatCurrency(stepPrice)}!`);
            return;
        }

        if (!sessionId) {
            setMessage("Không tìm thấy thông tin phiên đấu giá!");
            return;
        }

        setIsLoading(true);

        try {
            console.log("Submitting bid:", { sessionId, bidAmount: bidValue, token });
            await bidAPI.submitBid(sessionId, bidValue, token);

            setMessage('Đặt giá thành công!');
            setBidAmount('');

            // Cập nhật tất cả dữ liệu
            await Promise.all([
                fetchCurrentPrice(sessionId),
                fetchBidHistory(sessionId),
                fetchWinner(sessionId),
                // Có thể thêm fetch session detail để cập nhật trạng thái
                fetchSessionDetailById(sessionId)
            ]);

        } catch (error) {
            console.error('Bid submission error:', error);
            const errorMessage = error?.response?.data?.message ||
                error?.response?.data?.error ||
                error.message ||
                'Có lỗi xảy ra khi đặt giá';
            setMessage('Lỗi: ' + errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEndSession = async () => {
        if (!window.confirm("Bạn chắc chắn muốn kết thúc phiên đấu giá này?")) return;
        setIsLoading(true);
        try {
            await bidAPI.closeSession(sessionId, token);
            setMessage("Đã kết thúc phiên đấu giá!");
            fetchSessionDetailById(sessionId);
            fetchWinner(sessionId);
        } catch (error) {
            setMessage("Lỗi khi kết thúc phiên: " + (error?.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    if (loading) return <div style={{ padding: 32 }}>Đang tải...</div>;
    if (!user || ![USER_ROLES.BIDDER, USER_ROLES.ORGANIZER].includes(user.role)) {
        return <div style={{ color: 'red', padding: 32 }}>Bạn không có quyền truy cập.</div>;
    }

    const asset = sessionDetail?.asset || {};
    const images = asset.imageUrls || asset.image_urls || [];
    const status = sessionDetail?.status || sessionDetail?.sessionStatus || '';
    

    // Tính giá cao nhất của người dùng
    const yourHighestBid = Math.max(
        0,
        ...bidHistory
            .filter(bid => bid.userId === user.id)
            .map(bid => bid.price)
    );

    // Sắp xếp bidHistory: mới nhất đứng đầu (nếu cần thì dùng .sort, nếu đã đúng thì bỏ qua)
    const sortedBidHistory = [...bidHistory].sort((a, b) =>
        (b.createdAt && a.createdAt)
            ? new Date(b.createdAt) - new Date(a.createdAt)
            : (b.id || 0) - (a.id || 0)
    );

    return (
        <div style={{ maxWidth: "1280px", margin: "40px auto", padding: "0 24px" }}>
            {/* Breadcrumb */}
            <div style={{ marginBottom: 18, fontSize: 15 }}>
                <Link to="/">Trang chủ</Link> / <Link to="/ended-auctions">Tài sản đã đấu giá</Link> / Phiên đấu giá
            </div>

            {/* Title */}
            <h2 style={{
                fontSize: "36px",
                fontWeight: 600,
                marginBottom: "28px",
                color: "#222"
            }}>
                {sessionDetail?.title || asset.description || "Phiên đấu giá"}
            </h2>

            <div style={{ display: "flex", gap: 36, flexWrap: "wrap" }}>
                {/* Left Section - Images */}
                <div style={{ flex: 3, minWidth: 360 }}>
                    {/* Main Image */}
                    <div style={{
                        position: "relative",
                        width: "100%",
                        height: 480,
                        borderRadius: 12,
                        overflow: "hidden",
                        background: "#f4f4f4",
                        marginBottom: 16
                    }}>
                        <img
                            src={mainImage}
                            alt="main"
                            style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                objectFit: "cover"
                            }}
                            onError={(e) => {
                                if (e.currentTarget.src !== window.location.origin + DEFAULT_IMG) {
                                    e.currentTarget.src = DEFAULT_IMG;
                                }
                            }}
                        />
                    </div>

                    {/* Thumbnails với key ổn định */}
                    {images.length > 0 && (
                        <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
                            {images.map((img, i) => (
                                <img
                                    key={`thumb-${i}-${img}`}
                                    src={img}
                                    alt={`thumb-${i}`}
                                    onClick={() => setMainImage(img)}
                                    style={{
                                        width: 72,
                                        height: 72,
                                        objectFit: "cover",
                                        borderRadius: 8,
                                        border: mainImage === img ? "3px solid #d32f2f" : "1px solid #ccc",
                                        cursor: "pointer",
                                        transition: "border 0.2s"
                                    }}
                                    onError={(e) => {
                                        if (e.currentTarget.src !== window.location.origin + DEFAULT_IMG) {
                                            e.currentTarget.src = DEFAULT_IMG;
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Diễn biến phiên đấu giá */}
                    <div style={{
                        background: "#fff",
                        borderRadius: 12,
                        padding: "24px",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                        border: "2px solid #333"
                    }}>
                        <h3 style={{
                            textAlign: "center",
                            fontSize: 18,
                            fontWeight: "bold",
                            marginBottom: 24,
                            color: "#333"
                        }}>
                            DIỄN BIẾN PHIÊN ĐẤU GIÁ
                        </h3>

                        {/* Bidding slots với key ổn định */}
                        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
                            {[0, 1, 2].map((idx) => {
                                const bid = sortedBidHistory[idx];
                                return (
                                    <div key={`bid-slot-${idx}`} style={{
                                        flex: 1,
                                        border: "1px solid #333",
                                        padding: "12px",
                                        textAlign: "center"
                                    }}>
                                        <div style={{ fontWeight: "bold", marginBottom: 8, fontSize: 16 }}>
                                            {bid ? formatCurrency(bid.price) : "Chờ trả giá"}
                                        </div>
                                        <div style={{ fontSize: 12, color: "#666" }}>
                                            {bid
                                                ? (bid.fullName || bid.userName || 'Ẩn danh')
                                                : `Người đấu giá ${idx + 1}`}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Current price display */}
                        <div style={{
                            background: "#fff3cd",
                            border: "1px solid #333",
                            padding: "20px",
                            textAlign: "center",
                            marginBottom: 16,
                            position: "relative"
                        }}>
                            <div style={{
                                position: "absolute",
                                left: "20px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                fontSize: 24
                            }}>↑</div>

                            <div style={{
                                fontSize: 48,
                                fontWeight: "bold",
                                color: "#2e7d32"
                            }}>
                                {currentPrice || 0}
                            </div>
                            <div style={{ fontSize: 14, color: "#666" }}>
                                Bạn muốn tăm trệu đó tham nghiêm động
                            </div>

                            <div style={{
                                position: "absolute",
                                right: "20px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                fontSize: 24
                            }}>↓</div>
                        </div>

                        <div style={{ textAlign: "center", marginBottom: 16 }}>
                            Giá cao nhất hiện tại: <span style={{ color: "#d32f2f", fontWeight: "bold" }}>
                                {formatCurrency(currentPrice)}/m²
                            </span>
                        </div>

                        {/* Red button */}
                        <button style={{
                            width: "100%",
                            padding: "12px",
                            backgroundColor: "#dc3545",
                            color: "white",
                            border: "none",
                            borderRadius: 4,
                            fontSize: 14,
                            fontWeight: "bold"
                        }}>
                            Đặt mức giá cao hơn mức giá cao nhất
                        </button>
                    </div>
                </div>

                {/* Right Section - Auction Info */}
                <div style={{
                    flex: 2,
                    background: "#fff",
                    borderRadius: 12,
                    padding: "24px 28px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                    fontSize: 12,
                    color: "#333",
                    height: "fit-content"
                }}>
                    {/* Countdown Timer */}
                    <div style={{
                        textAlign: "center",
                        marginBottom: 24,
                        padding: 16,
                        background: "#f8f9fa",
                        borderRadius: 8
                    }}>
                        <h3 style={{ margin: "0 0 16px 0", fontSize: 16 }}>
                            Thời gian đếm ngược bắt đầu trả giá:
                        </h3>
                        <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
                            <div style={{ textAlign: "center" }}>
                                <div style={{ fontSize: 24, fontWeight: "bold" }}>{timeLeft.days}</div>
                                <div>NGÀY</div>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <div style={{ fontSize: 24, fontWeight: "bold" }}>{timeLeft.hours}</div>
                                <div>GIỜ</div>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <div style={{ fontSize: 24, fontWeight: "bold" }}>{timeLeft.minutes}</div>
                                <div>PHÚT</div>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <div style={{ fontSize: 24, fontWeight: "bold" }}>{timeLeft.seconds}</div>
                                <div>GIÂY</div>
                            </div>
                        </div>
                    </div>

                    {/* Asset Information */}
                    {[
                        { label: "Mã tài sản", value: asset.documentCode || asset.document_code },
                        { label: "Giá khởi điểm", value: formatCurrency(asset.startingPrice || asset.starting_price) },
                        { label: "Bước giá", value: formatCurrency(asset.step_price || asset.stepPrice) },
                        { label: "Số bước giá tối đa", value: sessionDetail?.max_step || "Không giới hạn" },
                        { label: "Tiền đặt trước", value: formatCurrency(asset.deposit_amount || asset.depositAmount) },
                        { label: "Phương thức đấu giá", value: "Trả giá lên và liên tục" },
                        { label: "Thời gian bắt đầu", value: formatDate(sessionDetail?.start_time || sessionDetail?.startTime) },
                        { label: "Thời gian kết thúc", value: formatDate(sessionDetail?.end_time || sessionDetail?.endTime) },
                        { label: "Danh mục", value: asset.categoryName },
                        { label: "Chủ sở hữu", value: asset.ownerUsername },
                        { label: "Giá cao nhất của bạn", value: formatCurrency(yourHighestBid) + "/m²" }
                    ].map((item, index) => (
                        <div key={index} style={{
                            display: "flex",
                            alignItems: "flex-start",
                            marginBottom: 10
                        }}>
                            <div style={{ minWidth: 180, fontWeight: "bold" }}>{item.label}:</div>
                            <div style={{
                                color: "#d32f2f",
                                whiteSpace: "pre-line",
                                textAlign: "left"
                            }}>{item.value}</div>
                        </div>
                    ))}

                    {/* Status */}
                    <div style={{
                        display: "flex",
                        alignItems: "flex-start",
                        marginBottom: 16
                    }}>
                        <div style={{ minWidth: 180, fontWeight: "bold" }}>Trạng thái:</div>
                        <div>
                            <span style={{
                                fontWeight: "bold",
                                textTransform: "uppercase",
                                color:
                                    status === "UPCOMING" ? "#2e7d32" :
                                        status === "ACTIVE" ? "#f9a825" :
                                            status === "FINISHED" ? "#d32f2f" : "#000"
                            }}>
                                {status}
                            </span>
                        </div>
                    </div>

                    {/* Winner info */}
                    {status === AUCTION_STATUS.FINISHED && winner && (
                        <div style={{
                            background: "#e8f5e8",
                            padding: 16,
                            borderRadius: 8,
                            marginBottom: 16
                        }}>
                            <h4 style={{ margin: "0 0 8px 0" }}>Người thắng phiên</h4>
                            <div>
                                <b>{winner.fullName}</b> với giá <b>{formatCurrency(winner.price)}</b>
                            </div>
                        </div>
                    )}

                    {/* Bidding form for BIDDER */}
                    {user.role === USER_ROLES.BIDDER && status === AUCTION_STATUS.ACTIVE && (
                        <div style={{
                            background: "#f8f9fa",
                            padding: 16,
                            borderRadius: 8,
                            marginBottom: 16
                        }}>
                            {message && (
                                <div style={{
                                    padding: 8,
                                    marginBottom: 12,
                                    borderRadius: 4,
                                    background: message.includes('thành công') ? '#d4edda' : '#f8d7da',
                                    color: message.includes('thành công') ? '#155724' : '#721c24'
                                }}>
                                    {message}
                                </div>
                            )}

                            <input
                                type="number"
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                placeholder="Số tiền đấu giá"
                                style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    marginBottom: 12,
                                    border: "1px solid #ccc",
                                    borderRadius: 4
                                }}
                                disabled={isLoading}
                            />

                            <button
                                onClick={handleBid}
                                disabled={isLoading}
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    backgroundColor: isLoading ? "#ccc" : "#dc3545",
                                    color: "white",
                                    border: "none",
                                    borderRadius: 4,
                                    cursor: isLoading ? "not-allowed" : "pointer",
                                    fontWeight: "bold"
                                }}
                            >
                                {isLoading ? 'ĐANG XỬ LÝ...' : 'TRẢ GIÁ'}
                            </button>

                            <div style={{ fontSize: 11, color: "#666", marginTop: 8, textAlign: "center" }}>
                                Số tiền này được đặt theo cách đấu giá trả lên
                            </div>
                        </div>
                    )}

                    {/* End session button for ORGANIZER */}
                    {user.role === USER_ROLES.ORGANIZER &&
                        sessionDetail?.organizerId === user.id &&
                        status === AUCTION_STATUS.ACTIVE && (
                            <button
                                onClick={handleEndSession}
                                disabled={isLoading}
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    backgroundColor: isLoading ? "#ccc" : "#28a745",
                                    color: "white",
                                    border: "none",
                                    borderRadius: 4,
                                    cursor: isLoading ? "not-allowed" : "pointer",
                                    fontWeight: "bold",
                                    marginBottom: 16
                                }}
                            >
                                {isLoading ? "ĐANG XỬ LÝ..." : "Kết thúc phiên đấu giá"}
                            </button>
                        )}

                    {/* Back button */}
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            width: "100%",
                            padding: "12px",
                            backgroundColor: "#6c757d",
                            color: "white",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer"
                        }}
                    >
                        ← Quay lại
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BiddingSection;