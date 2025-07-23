import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import apiClient from "../../services/api";

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
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState(DEFAULT_IMG);
    const [hasSetMainImage, setHasSetMainImage] = useState(false);
    const [joining, setJoining] = useState(false);
    const [joinMessage, setJoinMessage] = useState("");

    useEffect(() => {
        apiClient.get(`/sessions/code/${sessionCode}`)
            .then(res => {
                console.log("Session detail data:", res);
                setData(res.data ?? res);
            })
            .catch(() => setData(null))
            .finally(() => setLoading(false));
    }, [sessionCode]);

    useEffect(() => {
        if (!hasSetMainImage && data) {
            const images = data.image_urls || data.imageUrls || [];
            setMainImage(images.length > 0 ? images[0] : DEFAULT_IMG);
            setHasSetMainImage(true);
        }
    }, [data, hasSetMainImage]);

    if (loading) return <div style={{ padding: 32 }}>Đang tải chi tiết phiên đấu giá...</div>;
    if (!data) return <div style={{ color: 'red', padding: 32 }}>Không tìm thấy hoặc không có quyền xem phiên đấu giá này.</div>;

    const asset = data;
    const images = asset.image_urls || asset.imageUrls || [];

    const handleJoinAuction = async () => {
        if (!data?.id) return;
        setJoining(true);
        setJoinMessage("");
        try {
            await apiClient.post(`/participations/${data.id}/join`);
            setJoinMessage("✅ Tham gia phiên đấu giá thành công!");
            setTimeout(() => {
                navigate(`/sessions/${data.id}/bid`); // ✅ ĐÚNG ROUTE ĐÃ ĐĂNG KÝ
            }, 1000);
        } catch (error) {
            setJoinMessage("❌ Không thể tham gia phiên đấu giá. Vui lòng thử lại.");
        } finally {
            setJoining(false);
        }
    };


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
                    {[
                        { label: "Giá khởi điểm", value: formatCurrency(asset.starting_price) },
                        { label: "Mã tài sản", value: asset.document_code || "--" },
                        { label: "Thời gian mở đăng ký", value: formatDate(data.registration_start_time) },
                        { label: "Thời gian kết thúc đăng ký", value: formatDate(data.registration_end_time) },
                        { label: "Bước giá", value: formatCurrency(asset.step_price) },
                        { label: "Số bước giá tối đa", value: data.max_step || "Không giới hạn" },
                        { label: "Tiền đặt trước", value: formatCurrency(asset.deposit_amount) },
                        { label: "Nơi xem tài sản", value: asset.viewing_location?.trim() || "Đang cập nhật" }
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

                    {/* Khoảng cách giữa 2 nhóm */}
                    <div style={{ marginBottom: 16 }} />

                    <div style={{
                        textAlign: "center",
                        fontWeight: 800,
                        fontSize: 16,
                        margin: "0 0 12px"
                    }}>
                        Thời gian đấu giá
                    </div>

                    {[
                        { label: "Thời gian bắt đầu", value: formatDate(data.start_time) },
                        { label: "Thời gian kết thúc", value: formatDate(data.end_time) },
                        {
                            label: "Trạng thái", value: (
                                <span style={{
                                    fontWeight: "bold",
                                    textTransform: "uppercase",
                                    color:
                                        data.status === "UPCOMING" ? "#2e7d32" :
                                            data.status === "ONGOING" ? "#f9a825" :
                                                data.status === "ENDED" ? "#d32f2f" : "#000"
                                }}>
                                    {data.status}
                                </span>
                            )
                        }
                    ].map((item, index) => (
                        <div key={index} style={{
                            display: "flex",
                            alignItems: "flex-start",
                            marginBottom: 10
                        }}>
                            <div style={{ minWidth: 180, fontWeight: "bold" }}>{item.label}:</div>
                            <div style={{
                                color: item.label === "Trạng thái" ? "inherit" : "#d32f2f",
                                whiteSpace: "pre-line",
                                textAlign: "left"
                            }}>{item.value}</div>
                        </div>
                    ))}

                    {data.status === "UPCOMING" &&
                        new Date() >= new Date(data.registration_start_time) &&
                        new Date() <= new Date(data.registration_end_time) && (
                            <>
                                <div style={{ gridColumn: "1 / -1", textAlign: "center", marginTop: 16 }}>
                                    <button
                                        onClick={handleJoinAuction}
                                        disabled={joining}
                                        style={{
                                            width: "100%",
                                            padding: "12px 24px",
                                            fontSize: 16,
                                            backgroundColor: joining ? "#ccc" : "#d32f2f",
                                            color: "white",
                                            border: "none",
                                            borderRadius: 8,
                                            cursor: joining ? "not-allowed" : "pointer",
                                            opacity: joining ? 0.6 : 1
                                        }}
                                    >
                                        {joining ? "Đang gửi..." : "Tham gia đấu giá"}
                                    </button>
                                </div>
                                {joinMessage && (
                                    <div style={{ gridColumn: "1 / -1", textAlign: "center", color: joinMessage.includes("✅") ? "green" : "red", marginTop: 8 }}>
                                        {joinMessage}
                                    </div>
                                )}
                            </>
                        )}
                </div>
            </div>
        </div>
    );
};

export default SessionDetail;
