import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import apiClient from "../../services/api";
import { bidAPI } from "../../services/bid";

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

const formatCurrency = (num) =>
    typeof num === "number"
        ? num.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
        : "--";

const SessionDetail = () => {
    const navigate = useNavigate();
    const { sessionCode } = useParams();
    const { user, token } = useUser();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState(DEFAULT_IMG);
    const [hasSetMainImage, setHasSetMainImage] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [hasRegistered, setHasRegistered] = useState(false);

    // Lấy chi tiết phiên đấu giá
    useEffect(() => {
        setLoading(true);
        apiClient.get(`/sessions/code/${sessionCode}`)
            .then(res => {
                // Ưu tiên lấy trường hasRegistered từ backend nếu có
                let detail = res.data ?? res;
                setData(detail);
                if (detail.hasRegistered !== undefined) setHasRegistered(detail.hasRegistered);
            })
            .catch(() => setData(null))
            .finally(() => setLoading(false));
    }, [sessionCode]);

    // Khi data đổi, lấy lại hasRegistered nếu backend không trả về
    useEffect(() => {
        if (!hasSetMainImage && data) {
            const images = data.image_urls || data.imageUrls || [];
            setMainImage(images.length > 0 ? images[0] : DEFAULT_IMG);
            setHasSetMainImage(true);
        }
    }, [data, hasSetMainImage]);

    // Nếu đã đăng ký và phiên đang ACTIVE/ONGOING thì tự vào trang đấu giá
    useEffect(() => {
        if (
            hasRegistered &&
            data &&
            ["ACTIVE", "ONGOING"].includes(data.status?.toUpperCase())
        ) {
            setTimeout(() => {
                navigate(`/auction/${sessionCode}`);
            }, 900); // delay nhẹ để show thông báo đã đăng ký
        }
    }, [hasRegistered, data, sessionCode, navigate]);

    // Hàm đăng ký (cả UPCOMING & ACTIVE/ONGOING)
    const handleRegister = async () => {
        if (!user || !token) {
            setMessage("Vui lòng đăng nhập để tham gia đấu giá");
            return;
        }
        setActionLoading(true);
        setMessage("");
        try {
            // Nếu cần đặt cọc trước khi đăng ký
            const asset = data;
            const depositAmount = asset.deposit_amount || 0;
            if (depositAmount > 0) {
                const balanceRes = await apiClient.get("/users/balance", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const currentBalance = balanceRes.data?.balance || 0;
                if (currentBalance < depositAmount) {
                    setMessage(`Số dư không đủ. Cần ${formatCurrency(depositAmount)} để đặt cọc`);
                    setActionLoading(false);
                    return;
                }
                // Trừ tiền đặt cọc
                await apiClient.post("/users/deduct-deposit", {
                    sessionCode: sessionCode,
                    amount: depositAmount
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            // Đăng ký
            await bidAPI.registerParticipant(sessionCode, token);

            setMessage("Đăng ký thành công!");
            setHasRegistered(true); // cập nhật local luôn

            // Nếu là ACTIVE/ONGOING chuyển hướng luôn
            const status = data.status?.toUpperCase();
            if (status === "ACTIVE" || status === "ONGOING") {
                setTimeout(() => {
                    navigate(`/auction/${sessionCode}`);
                }, 1100);
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error.message || "Có lỗi xảy ra";
            setMessage(`Lỗi: ${errorMessage}`);
            // Nếu lỗi là đã đăng ký và phiên đang active thì cũng chuyển hướng luôn
            if (
                (errorMessage.includes("đã đăng ký phiên") || errorMessage.includes("already registered")) &&
                data &&
                ["ACTIVE", "ONGOING"].includes(data.status?.toUpperCase())
            ) {
                setHasRegistered(true);
                setTimeout(() => {
                    navigate(`/auction/${sessionCode}`);
                }, 1000);
            }
            // Nếu backend trả về lỗi đã đăng ký phiên, disable nút
            if (
                errorMessage.includes("đã đăng ký phiên") ||
                errorMessage.includes("already registered")
            ) {
                setHasRegistered(true);
            }
        } finally {
            setActionLoading(false);
        }
    };

    // Render nút action
    const renderActionButton = () => {
        if (!data) return null;
        const status = data.status?.toUpperCase();
        // Đã đăng ký (dựa vào hasRegistered)
        const registered = hasRegistered;
        if (status === "ACTIVE" || status === "ONGOING") {
            return (
                <button
                    onClick={handleRegister}
                    disabled={actionLoading || registered}
                    style={{
                        backgroundColor: "#d32f2f",
                        color: "white",
                        padding: "12px 24px",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        cursor: actionLoading || registered ? "not-allowed" : "pointer",
                        opacity: actionLoading || registered ? 0.7 : 1,
                        marginTop: "16px",
                        width: "100%"
                    }}
                >
                    {registered ? "Đã đăng ký" : (actionLoading ? "Đang xử lý..." : "Đăng ký & Vào đấu giá")}
                </button>
            );
        }
        if (status === "UPCOMING") {
            return (
                <button
                    onClick={handleRegister}
                    disabled={actionLoading || registered}
                    style={{
                        backgroundColor: "#1976d2",
                        color: "white",
                        padding: "12px 24px",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        cursor: actionLoading || registered ? "not-allowed" : "pointer",
                        opacity: actionLoading || registered ? 0.7 : 1,
                        marginTop: "16px",
                        width: "100%"
                    }}
                >
                    {registered ? "Đã đăng ký" : (actionLoading ? "Đang xử lý..." : "Đăng ký trước phiên đấu giá")}
                </button>
            );
        }
        if (status === "ENDED" || status === "FINISHED") {
            return (
                <div style={{
                    backgroundColor: "#f5f5f5",
                    color: "#666",
                    padding: "12px 24px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    textAlign: "center",
                    marginTop: "16px"
                }}>
                    Phiên đấu giá đã kết thúc
                </div>
            );
        }
        return null;
    };

    if (loading) return <div style={{ padding: 32 }}>Đang tải chi tiết phiên đấu giá...</div>;
    if (!data) return <div style={{ color: 'red', padding: 32 }}>Không tìm thấy hoặc không có quyền xem phiên đấu giá này.</div>;

    const asset = data;
    const images = asset.image_urls || asset.imageUrls || [];

    // const handleJoinAuction = async () => {
    //     if (!data?.id) return;
    //     setJoining(true);
    //     setJoinMessage("");
    //     try {
    //         await apiClient.post(`/participations/${data.id}/join`);
    //         setJoinMessage("✅ Tham gia phiên đấu giá thành công!");
    //         setTimeout(() => {
    //             navigate(`/sessions/${data.id}/bid`); // ✅ ĐÚNG ROUTE ĐÃ ĐĂNG KÝ
    //         }, 1000);
    //     } catch (error) {
    //         setJoinMessage("❌ Không thể tham gia phiên đấu giá. Vui lòng thử lại.");
    //     } finally {
    //         setJoining(false);
    //     }
    // };


    return (
        <div style={{ maxWidth: "1280px", margin: "40px auto", padding: "0 24px" }}>
            <div style={{ marginBottom: 18, fontSize: 15 }}>
                <Link to="/">Trang chủ</Link> / <Link to="/ended-auctions">Tài sản đã đấu giá</Link>
            </div>

            <h2 style={{
                fontSize: "36px",
                fontWeight: 600,
                marginBottom: "28px",
                color: "#222"
            }}>
                {data.title || asset.description}
            </h2>

            <div style={{ display: "flex", gap: 36, flexWrap: "wrap" }}>
                {/* Hình ảnh chính */}
                <div style={{ flex: 3, minWidth: 360 }}>
                    <div style={{
                        position: "relative",
                        width: "100%",
                        height: 480,
                        borderRadius: 12,
                        overflow: "hidden",
                        background: "#f4f4f4"
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
                    {/* Thumbnails */}
                    {images.length > 0 && (
                        <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
                            {images.map((img, i) => (
                                <img
                                    key={i}
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
                </div>

                {/* Thông tin đấu giá */}
                <div style={{
                    flex: 2,
                    background: "#fff",
                    borderRadius: 12,
                    padding: "24px 28px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                    fontSize: 12,
                    color: "#333"
                }}>
                    <div><b>Giá khởi điểm:</b></div>
                    <div style={{ color: "#d32f2f", fontWeight: "bold" }}>{formatCurrency(asset.starting_price)}</div>
                    <div><b>Mã tài sản:</b></div>
                    <div style={{ color: "#d32f2f" }}>{asset.document_code || "--"}</div>
                    <div><b>Thời gian mở đăng ký:</b></div>
                    <div style={{ color: "#d32f2f" }}>{formatDate(data.registration_start_time)}</div>
                    <div><b>Thời gian kết thúc đăng ký:</b></div>
                    <div style={{ color: "#d32f2f" }}>{formatDate(data.registration_end_time)}</div>
                    <div><b>Bước giá:</b></div>
                    <div style={{ color: "#d32f2f" }}>{formatCurrency(asset.step_price)}</div>
                    <div><b>Số bước giá tối đa:</b></div>
                    <div style={{ color: "#d32f2f" }}>{data.max_step || "Không giới hạn"}</div>
                    <div><b>Tiền đặt trước:</b></div>
                    <div style={{ color: "#d32f2f" }}>{formatCurrency(asset.deposit_amount)}</div>
                    <div><b>Nơi xem tài sản:</b></div>
                    <div style={{ color: "#d32f2f", whiteSpace: "pre-line" }}>{asset.viewing_location?.trim() ? asset.viewing_location : "Đang cập nhật"}</div>
                    <div style={{ gridColumn: "1 / -1", textAlign: "center", fontWeight: 900, fontSize: 20, margin: "8px 0" }}>
                        Thời gian đấu giá
                    </div>
                    <div><b>Thời gian bắt đầu:</b></div>
                    <div style={{ color: "#d32f2f" }}>{formatDate(data.start_time)}</div>
                    <div><b>Thời gian kết thúc:</b></div>
                    <div style={{ color: "#d32f2f" }}>{formatDate(data.end_time)}</div>
                    <div><b>Trạng thái:</b></div>
                    <div style={{
                        fontWeight: "bold",
                        color: data.status?.toUpperCase() === 'ONGOING' ? '#d32f2f' :
                              data.status?.toUpperCase() === 'UPCOMING' ? '#1976d2' : '#666'
                    }}>
                        {data.status}
                    </div>
                    {/* Thông báo */}
                    {message && (
                        <div style={{
                            gridColumn: "1 / -1",
                            padding: "12px",
                            borderRadius: "6px",
                            backgroundColor: message.includes("thành công") ? "#e8f5e8" : "#ffeaea",
                            color: message.includes("thành công") ? "#2e7d2e" : "#d32f2f",
                            border: `1px solid ${message.includes("thành công") ? "#4caf50" : "#f44336"}`,
                            fontSize: "14px",
                            textAlign: "center"
                        }}>
                            {message}
                        </div>
                    )}
                    {/* Nút hành động */}
                    <div style={{ gridColumn: "1 / -1" }}>
                        {renderActionButton()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionDetail;
