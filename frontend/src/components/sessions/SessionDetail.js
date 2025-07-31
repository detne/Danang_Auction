import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import apiClient from "../../services/api";
import { USER_ROLES } from "../../utils/constants";
import ActionButton from './ActionButton';
import BreadcrumbNav from "../../components/assets/BreadcrumbNav";


const DEFAULT_IMG = "/images/past-auction-default.jpg";

// Mock data for related assets (giữ nguyên như yêu cầu)
const MOCK_RELATED_ASSETS = [
    {
        id: 1,
        session_code: "LSA-2024-001",
        title: "Phương tiện vận tải và máy móc, thiết bị sản xuất sản phẩm tre, nứa tại sản kế biến của Phòng thí hành án dân sự của Phòng thí hành án khu vực 4 tỉnh Cao Bằng",
        description: "Phương tiện vận tải và máy móc, thiết bị sản xuất sản phẩm tre, nứa tại sản kế biến của Phòng thí hành án dân sự của Phòng thí hành án khu vực 4 tỉnh Cao Bằng",
        starting_price: 316000000,
        location: "Cao Bằng",
        viewing_location: "Cao Bằng",
        image_urls: ["/images/auction-gavel-1.jpg"],
        imageUrls: ["/images/auction-gavel-1.jpg"]
    },
    {
        id: 2,
        session_code: "LSA-2024-002",
        title: "Quyền sử dụng đất và tài sản gắn liền với đất tại thửa đất số: 133, tờ bản đồ số: 1, địa chỉ: xã Láng Dài, huyện Đất Đỏ, tỉnh Bà Rịa – Vũng Tàu (nay là xã Đất Đỏ, Tp. Hồ Chí Minh)",
        description: "Quyền sử dụng đất và tài sản gắn liền với đất",
        starting_price: 385000000,
        location: "Bà Rịa - Vũng Tàu",
        viewing_location: "xã Láng Dài, huyện Đất Đỏ, tỉnh Bà Rịa – Vũng Tàu",
        image_urls: ["/images/auction-gavel-2.jpg"],
        imageUrls: ["/images/auction-gavel-2.jpg"]
    },
    {
        id: 3,
        session_code: "LSA-2024-003",
        title: "Quyền sử dụng đất và tài sản gắn liền với đất tại thửa đất số: 132, tờ bản đồ số: 1, địa chỉ: xã Láng Dài, huyện Đất Đỏ, tỉnh Bà Rịa – Vũng Tàu (nay là xã Đất Đỏ, Tp. Hồ Chí Minh)",
        description: "Quyền sử dụng đất và tài sản gắn liền với đất",
        starting_price: 400000000,
        location: "Bà Rịa - Vũng Tàu",
        viewing_location: "xã Láng Dài, huyện Đất Đỏ, tỉnh Bà Rịa – Vũng Tàu",
        image_urls: ["/images/auction-gavel-3.jpg"],
        imageUrls: ["/images/auction-gavel-3.jpg"]
    },
];

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
    const [joining, setJoining] = useState(false);
    const [joinMessage, setJoinMessage] = useState("")
    const { sessionCode } = useParams();
    const { user } = useUser();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null); // Thêm để xử lý lỗi 403, 404
    const [loadingData, setLoadingData] = useState(true);
    const [mainImage, setMainImage] = useState(DEFAULT_IMG);
    const [hasSetMainImage, setHasSetMainImage] = useState(false);
    const [alreadyJoined, setAlreadyJoined] = useState(false);
    const [relatedAssets, setRelatedAssets] = useState([]);
    const [activeTab, setActiveTab] = useState("description");

    // Use mock data for related assets
    useEffect(() => {
        if (!data) return;
        const filteredAssets = MOCK_RELATED_ASSETS.filter(item => item.id !== data.id);
        setRelatedAssets(filteredAssets.slice(0, 4));
    }, [data]);

    // Lấy chi tiết phiên với xử lý lỗi
    useEffect(() => {
        setLoadingData(true);
        setError(null);
        apiClient.get(`/sessions/code/${sessionCode}`)
            .then(res => {
                const resData = res.data ?? res;
                setData(resData);
                setAlreadyJoined(resData?.already_joined ?? false);
            })
            .catch(err => {
                if (err.response?.status === 403) {
                    setError("Bạn không có quyền xem phiên này. Hãy đăng ký tham gia hoặc kiểm tra login.");
                } else if (err.response?.status === 404) {
                    setError("Phiên đấu giá không tồn tại hoặc session code sai.");
                } else {
                    setError("Lỗi khi tải dữ liệu. Vui lòng thử lại.");
                }
                setData(null);
            })
            .finally(() => setLoadingData(false));
    }, [sessionCode]);

    useEffect(() => {
        if (!hasSetMainImage && data) {
            const images = data.image_urls || data.imageUrls || [];
            setMainImage(images.length > 0 ? images[0] : DEFAULT_IMG);
            setHasSetMainImage(true);
        }
    }, [data, hasSetMainImage]);

    // Handler tham gia đấu giá
    const handleJoinAuction = async () => {
        setJoinMessage("");
        if (!user || !user.token) {
            setJoinMessage("❌ Bạn cần đăng nhập để tham gia đấu giá.");
            setTimeout(() => navigate("/login"), 1200);
            return;
        }

        if (user.role !== USER_ROLES.BIDDER) {
            setJoinMessage("❌ Chỉ người dùng vai trò BIDDER mới được tham gia phiên.");
            return;
        }

        setJoining(true);
        try {
            await apiClient.post(
                `/sessions/${sessionCode}/register`,
                {},
                { headers: { Authorization: `Bearer ${user.token}` } }
            );

            // Sau khi đặt cọc thành công -> reload dữ liệu phiên để cập nhật trạng thái
            const res = await apiClient.get(`/sessions/code/${sessionCode}`);
            setData(res.data ?? res);

            setJoinMessage("✅ Đặt cọc thành công! Vui lòng đợi đến giờ bắt đầu phiên.");
        } catch (error) {
            const msg = error?.response?.data?.message || "Không thể tham gia phiên đấu giá. Vui lòng thử lại.";
            setJoinMessage("❌ " + msg);
        } finally {
            setJoining(false);
        }
    };

    if (loadingData) return <div style={{ padding: 32 }}>Đang tải chi tiết phiên đấu giá...</div>;
    if (error) return <div style={{ color: 'red', padding: 32 }}>{error}</div>;
    if (!data) return <div style={{ color: 'red', padding: 32 }}>Không tìm thấy phiên đấu giá.</div>;

    const asset = data;
    const images = asset.image_urls || asset.imageUrls || [];
    const now = new Date();
    const regStart = new Date(data.registration_start_time);
    const regEnd = new Date(data.registration_end_time);

    const allowJoin =
        data.status === "UPCOMING" &&
        now >= regStart &&
        now <= regEnd &&
        user &&
        user.role === USER_ROLES.BIDDER &&
        !alreadyJoined;

    // Render UI (giữ nguyên, chỉ thêm fallback nếu cần)
    return (
        <div style={{ maxWidth: "1280px", margin: "40px auto", padding: "0 24px" }}>
            <div style={{ marginBottom: 18, fontSize: 15 }}>
            <BreadcrumbNav
                items={[
                    { label: "Trang chủ", to: "/" },
                    { label: "Tài sản đã đấu giá" },
                ]}
            />
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
                                            data.status === "ACTIVE" ? "#f9a825" :
                                                data.status === "FINISHED" ? "#d32f2f" : "#000"
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

                    {/* Đã tham gia thì show nút Đến phòng đấu giá */}
                    <ActionButton
                        data={data}
                        onRequestDeposit={handleJoinAuction}
                    />

                    {/* Nếu không được join, hiển thị trạng thái */}
                    {!allowJoin && !alreadyJoined && user && user.role === USER_ROLES.BIDDER && (
                        <div style={{ textAlign: "center", color: "#888", marginTop: 18 }}>
                            {now < regStart && "Chưa đến thời gian mở đăng ký tham gia!"}
                            {now > regEnd && "Đã hết hạn đăng ký tham gia phiên này!"}
                            {data.status !== "UPCOMING" && "Phiên đã bắt đầu hoặc đã kết thúc!"}
                        </div>
                    )}

                    {!user && (
                        <div style={{ textAlign: "center", color: "#888", marginTop: 18 }}>
                            Bạn cần <Link to="/login">đăng nhập</Link> để tham gia đấu giá.
                        </div>
                    )}
                </div>
            </div>

            {/* New Tabbed Interface Section */}
            <div style={{ marginTop: 48 }}>
                {/* Tab Navigation */}
                <div style={{
                    display: "flex",
                    borderBottom: "2px solid #f0f0f0",
                    marginBottom: 24
                }}>
                    {[
                        { key: "description", label: "Mô tả tài sản" },
                        { key: "auction_info", label: "Thông tin đấu giá" },
                        { key: "documents", label: "Tài liệu liên quan" }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            style={{
                                padding: "12px 24px",
                                fontSize: 16,
                                fontWeight: 600,
                                border: "none",
                                background: activeTab === tab.key ? "#d32f2f" : "transparent",
                                color: activeTab === tab.key ? "white" : "#666",
                                cursor: "pointer",
                                borderRadius: activeTab === tab.key ? "8px 8px 0 0" : "0",
                                transition: "all 0.3s ease"
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div style={{
                    minHeight: 200,
                    padding: "24px 0",
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: "#333"
                }}>
                    {activeTab === "description" && (
                        <div>
                            <h3 style={{ marginBottom: 16, fontSize: 18, fontWeight: 600 }}>Mô tả chi tiết tài sản</h3>
                            <p style={{ marginBottom: 12 }}>
                                {asset.description || "Đang cập nhật thông tin mô tả chi tiết về tài sản này."}
                            </p>
                            {asset.specifications && (
                                <div style={{ marginTop: 20 }}>
                                    <h4 style={{ marginBottom: 12, fontWeight: 600 }}>Thông số kỹ thuật:</h4>
                                    <p>{asset.specifications}</p>
                                </div>
                            )}
                            {asset.condition && (
                                <div style={{ marginTop: 20 }}>
                                    <h4 style={{ marginBottom: 12, fontWeight: 600 }}>Tình trạng tài sản:</h4>
                                    <p>{asset.condition}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "auction_info" && (
                        <div>
                            <h3 style={{ marginBottom: 16, fontSize: 18, fontWeight: 600 }}>Thông tin chi tiết về phiên đấu giá</h3>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                <div>
                                    <h4 style={{ marginBottom: 12, fontWeight: 600 }}>Thông tin cơ bản:</h4>
                                    <p><strong>Mã phiên:</strong> {data.session_code || "--"}</p>
                                    <p><strong>Loại đấu giá:</strong> {data.auction_type || "Đấu giá công khai"}</p>
                                    <p><strong>Phương thức:</strong> {data.method || "Trực tuyến"}</p>
                                </div>
                                <div>
                                    <h4 style={{ marginBottom: 12, fontWeight: 600 }}>Quy định:</h4>
                                    <p><strong>Thời gian đăng ký:</strong> Từ {formatDate(data.registration_start_time)} đến {formatDate(data.registration_end_time)}</p>
                                    <p><strong>Bước giá tối thiểu:</strong> {formatCurrency(asset.step_price)}</p>
                                    <p><strong>Tiền bảo đảm:</strong> {formatCurrency(asset.deposit_amount)}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "documents" && (
                        <div>
                            <h3 style={{ marginBottom: 16, fontSize: 18, fontWeight: 600 }}>Tài liệu liên quan</h3>
                            <div style={{ display: "grid", gap: 12 }}>
                                {data.documents && data.documents.length > 0 ? (
                                    data.documents.map((doc, index) => (
                                        <div key={index} style={{
                                            padding: 12,
                                            border: "1px solid #e0e0e0",
                                            borderRadius: 8,
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center"
                                        }}>
                                            <span>{doc.name || `Tài liệu ${index + 1}`}</span>
                                            <a
                                                href={doc.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    color: "#d32f2f",
                                                    textDecoration: "none",
                                                    fontWeight: 600
                                                }}
                                            >
                                                Tải xuống
                                            </a>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ color: "#666", fontStyle: "italic" }}>
                                        Hiện tại chưa có tài liệu liên quan nào được đăng tải.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Related Assets Section */}
            <div style={{ marginTop: 48 }}>
                <h3 style={{
                    fontSize: 24,
                    fontWeight: 600,
                    marginBottom: 24,
                    color: "#222"
                }}>
                    Tài sản khác
                </h3>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: 24
                }}>
                    {relatedAssets.map((relatedAsset, index) => (
                        <div key={index} style={{
                            background: "#fff",
                            borderRadius: 12,
                            overflow: "hidden",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                            border: "1px solid #f0f0f0"
                        }}
                             onMouseEnter={(e) => {
                                 e.currentTarget.style.transform = "translateY(-4px)";
                                 e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
                             }}
                             onMouseLeave={(e) => {
                                 e.currentTarget.style.transform = "translateY(0)";
                                 e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)";
                             }}
                        >
                            {/* Asset Image */}
                            <div style={{
                                width: "100%",
                                height: 200,
                                position: "relative",
                                overflow: "hidden",
                                background: "#f8f9fa"
                            }}>
                                <img
                                    src={relatedAsset.image_urls?.[0] || relatedAsset.imageUrls?.[0] || DEFAULT_IMG}
                                    alt={relatedAsset.title || relatedAsset.description}
                                    style={{
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
                                {/* Company Logo and Gavel overlay */}
                                <div style={{
                                    position: "absolute",
                                    top: 12,
                                    right: 12,
                                    background: "rgba(255, 255, 255, 0.95)",
                                    borderRadius: 8,
                                    padding: "6px 10px",
                                    fontSize: 10,
                                    fontWeight: 600,
                                    color: "#d32f2f",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                                }}>
                                    <span style={{
                                        background: "#d32f2f",
                                        color: "white",
                                        borderRadius: "50%",
                                        width: 16,
                                        height: 16,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 8
                                    }}>⚖️</span>
                                    LSA
                                </div>

                                {/* Company watermark */}
                                <div style={{
                                    position: "absolute",
                                    bottom: 12,
                                    left: 12,
                                    background: "rgba(211, 47, 47, 0.9)",
                                    borderRadius: 6,
                                    padding: "4px 8px",
                                    fontSize: 10,
                                    fontWeight: 600,
                                    color: "white",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4
                                }}>
                                    <span>🏛️</span>
                                    CÔNG TY ĐẤU GIÁ HỢP DANH LÂM SƠN SÀI GÒN
                                </div>
                            </div>

                            {/* Asset Info */}
                            <div style={{ padding: 20 }}>
                                <h4 style={{
                                    fontSize: 14,
                                    fontWeight: 600,
                                    marginBottom: 12,
                                    color: "#222",
                                    lineHeight: 1.4,
                                    display: "-webkit-box",
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    minHeight: 60
                                }}>
                                    {relatedAsset.title || relatedAsset.description || "Tài sản đấu giá"}
                                </h4>

                                <div style={{
                                    fontSize: 16,
                                    fontWeight: 700,
                                    color: "#d32f2f",
                                    marginBottom: 16,
                                    textAlign: "center"
                                }}>
                                    Giá khởi điểm: {formatCurrency(relatedAsset.starting_price)}
                                </div>

                                <button
                                    onClick={() => navigate(`/sessions/${relatedAsset.session_code || relatedAsset.id}`)}
                                    style={{
                                        width: "100%",
                                        padding: "10px 16px",
                                        fontSize: 14,
                                        fontWeight: 600,
                                        backgroundColor: "#d32f2f",
                                        color: "white",
                                        border: "none",
                                        borderRadius: 6,
                                        cursor: "pointer",
                                        transition: "all 0.3s ease"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = "#b71c1c";
                                        e.currentTarget.style.transform = "translateY(-1px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = "#d32f2f";
                                        e.currentTarget.style.transform = "translateY(0)";
                                    }}
                                >
                                    Xem chi tiết
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {relatedAssets.length === 0 && (
                    <div style={{
                        textAlign: "center",
                        padding: 40,
                        color: "#666",
                        fontStyle: "italic"
                    }}>
                        Hiện tại chưa có tài sản liên quan nào.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SessionDetail;