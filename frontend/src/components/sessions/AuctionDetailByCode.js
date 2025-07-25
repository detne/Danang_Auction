import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
    typeof num === "number" && num > 0
        ? num.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
        : "--";

const AuctionDetailByCode = () => {
    const { sessionCode } = useParams();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState(DEFAULT_IMG);
    const [hasSetMainImage, setHasSetMainImage] = useState(false);

    useEffect(() => {
        apiClient.get(`/sessions/code/${sessionCode}`)
            .then(res => {
                console.log("Session detail data:", res.data);
                setSession(res.data ?? res);
            })
            .catch(() => setSession(null))
            .finally(() => setLoading(false));
    }, [sessionCode]);

    useEffect(() => {
        if (!hasSetMainImage && session) {
            const images = session.image_urls || session.imageUrls || [];
            setMainImage(images.length > 0 ? images[0] : DEFAULT_IMG);
            setHasSetMainImage(true);
        }
    }, [session, hasSetMainImage]);

    if (loading) return <div style={{ padding: 32 }}>Đang tải chi tiết phiên đấu giá...</div>;
    if (!session) return <div style={{ color: 'red', padding: 32 }}>Không tìm thấy hoặc không có quyền xem phiên đấu giá này.</div>;

    const images = session.image_urls || session.imageUrls || [];

    return (
        <div style={{ maxWidth: "1280px", margin: "40px auto", padding: "0 24px" }}>
            <div style={{ marginBottom: 18, fontSize: 15 }}>
                <Link to="/"> Trang chủ</Link> / <Link to="/ended-auctions">Tài sản đã đấu giá</Link>
            </div>

            <h2 style={{
                fontSize: "36px",
                fontWeight: 600,
                marginBottom: "28px",
                color: "#222"
            }}>
                Phiên đấu giá - {session.title || session.description || "--"}
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
                    fontSize: 16,
                    color: "#333",
                    display: "grid",
                    gridTemplateColumns: "180px 1fr",
                    rowGap: "12px",
                    columnGap: "16px",
                    alignItems: "start"
                }}>
                    <div><b>Giá khởi điểm:</b></div>
                    <div style={{ color: "#d32f2f", fontWeight: "bold" }}>{formatCurrency(session.starting_price)}</div>

                    <div><b>Mã tài sản:</b></div>
                    <div style={{ color: "#d32f2f" }}>{session.document_code || "--"}</div>

                    <div><b>Thời gian mở đăng ký:</b></div>
                    <div style={{ color: "#d32f2f" }}>{formatDate(session.registrationStartTime)}</div>

                    <div><b>Thời gian kết thúc đăng ký:</b></div>
                    <div style={{ color: "#d32f2f" }}>{formatDate(session.registrationEndTime)}</div>

                    <div><b>Bước giá:</b></div>
                    <div style={{ color: "#d32f2f" }}>{formatCurrency(session.step_price)}</div>

                    <div><b>Số bước giá tối đa:</b></div>
                    <div style={{ color: "#d32f2f" }}>{session.maxStep || "Không giới hạn"}</div>

                    <div><b>Tiền đặt trước:</b></div>
                    <div style={{ color: "#d32f2f" }}>{formatCurrency(session.deposit_amount)}</div>

                    <div><b>Nơi xem tài sản:</b></div>
                    <div style={{ color: "#d32f2f", whiteSpace: "pre-line" }}>{session.viewingLocation?.trim() ? session.viewingLocation : "Đang cập nhật"}</div>

                    <div style={{ gridColumn: "1 / -1", textAlign: "center", fontWeight: 900, fontSize: 20, margin: "8px 0" }}>
                        Thời gian đấu giá
                    </div>

                    <div><b>Thời gian bắt đầu:</b></div>
                    <div style={{ color: "#d32f2f" }}>{formatDate(session.start_time)}</div>

                    <div><b>Thời gian kết thúc:</b></div>
                    <div style={{ color: "#d32f2f" }}>{formatDate(session.end_time)}</div>

                    <div><b>Trạng thái:</b></div>
                    <div style={{ fontWeight: "bold" }}>{session.status} {session.status === "FINISHED" && "(Đã kết thúc)"}</div>
                </div>
            </div>
        </div>
    );
};

export default AuctionDetailByCode;