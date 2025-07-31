// src/components/AssetDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { assetAPI } from '../../services/asset';
import BreadcrumbNav from "./BreadcrumbNav";
import '../../styles/AssetDetail.css'; // Import custom styles

const DEFAULT_IMG = "/images/past-auction-default.jpg";

// Mock data for related assets - FIXED: Sử dụng cấu trúc images với object
const MOCK_RELATED_ASSETS = [
    {
        id: 1,
        document_code: "MTS-2024-001",
        description: "Phương tiện vận tải và máy móc, thiết bị sản xuất sản phẩm tre, nứa tại sản kế biến",
        starting_price: 316000000,
        images: [{ url: "/images/auction-gavel-1.jpg" }] // Changed from image_urls to images
    },
    {
        id: 2,
        document_code: "MTS-2024-002",
        description: "Quyền sử dụng đất và tài sản gắn liền với đất tại thửa đất số: 133",
        starting_price: 385000000,
        images: [{ url: "/images/auction-gavel-2.jpg" }]
    },
    {
        id: 3,
        document_code: "MTS-2024-003",
        description: "Quyền sử dụng đất và tài sản gắn liền với đất tại thửa đất số: 132",
        starting_price: 400000000,
        images: [{ url: "/images/auction-gavel-3.jpg" }]
    },
    {
        id: 4,
        document_code: "MTS-2024-004",
        description: "Quyền sử dụng đất và tài sản gắn liền với đất tại thửa đất số: 131",
        starting_price: 415000000,
        images: [{ url: "/images/auction-gavel-4.jpg" }]
    }
];

const formatDateCustom = (str) => {
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

const getStatusText = (status) => {
    const statusMap = {
        'APPROVED': 'Đã duyệt',
        'PENDING': 'Chờ duyệt',
        'REJECTED': 'Bị từ chối',
        'DRAFT': 'Bản nháp'
    };
    return statusMap[status] || status;
};

const getStatusColor = (status) => {
    const colorMap = {
        'APPROVED': '#2e7d32',
        'PENDING': '#f9a825',
        'REJECTED': '#d32f2f',
        'DRAFT': '#666'
    };
    return colorMap[status] || '#666';
};

const getAuctionTypeText = (type) => {
    const typeMap = {
        'PUBLIC': 'Đấu giá công khai',
        'PRIVATE': 'Đấu giá riêng tư'
    };
    return typeMap[type] || type;
};

const AssetDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [asset, setAsset] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('description');
    const [mainImage, setMainImage] = useState(DEFAULT_IMG);
    const [hasSetMainImage, setHasSetMainImage] = useState(false);
    const [relatedAssets, setRelatedAssets] = useState([]);

    // Use mock data for related assets
    useEffect(() => {
        if (!asset) return;
        const filteredAssets = MOCK_RELATED_ASSETS.filter(item => item.id !== asset.id);
        setRelatedAssets(filteredAssets.slice(0, 4));
    }, [asset]);

    // Fetch asset data from API
    useEffect(() => {
        const fetchAssetData = async () => {
            try {
                setLoading(true);
                const response = await assetAPI.getAssetById(id);

                // API trả về trực tiếp data object
                setAsset(response);
            } catch (err) {
                console.error('Error fetching asset:', err);
                setError(err.message || 'Lỗi khi tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchAssetData();
        }
    }, [id]);

    // FIXED: Xử lý set main image với cả hai cấu trúc dữ liệu
    useEffect(() => {
        if (!hasSetMainImage && asset) {
            let imageUrl = DEFAULT_IMG;

            // Ưu tiên images (cấu trúc mới)
            if (asset.images && Array.isArray(asset.images) && asset.images.length > 0) {
                imageUrl = asset.images[0].url;
            }
            // Fallback về image_url và image_urls (cấu trúc cũ)
            else if (asset.image_url) {
                imageUrl = asset.image_url;
            } else if (asset.image_urls && asset.image_urls.length > 0) {
                imageUrl = asset.image_urls[0];
            }

            setMainImage(imageUrl);
            setHasSetMainImage(true);
        }
    }, [asset, hasSetMainImage]);

    if (loading) {
        return <div style={{ padding: 32 }}>Đang tải chi tiết tài sản...</div>;
    }

    if (error) {
        return <div style={{ color: 'red', padding: 32 }}>Lỗi: {error}</div>;
    }

    if (!asset) {
        return <div style={{ color: 'red', padding: 32 }}>Không tìm thấy tài sản với ID {id}.</div>;
    }

    // FIXED: Xử lý hình ảnh với cả hai cấu trúc dữ liệu
    const images = [];

    // Ưu tiên images (cấu trúc mới)
    if (asset.images && Array.isArray(asset.images)) {
        asset.images.forEach((img, index) => {
            if (img && img.url) {
                images.push({ url: img.url, type: img.type || `Ảnh ${index + 1}` });
            }
        });
    }
    // Fallback về image_urls (cấu trúc cũ)
    else if (asset.image_urls && Array.isArray(asset.image_urls)) {
        asset.image_urls.forEach((url, index) => {
            if (url) images.push({ url, type: `Ảnh ${index + 1}` });
        });
    }
    // Fallback về image_url đơn lẻ
    else if (asset.image_url) {
        images.push({ url: asset.image_url, type: 'Ảnh chính' });
    }

    return (
        <div style={{ maxWidth: "1280px", margin: "40px auto", padding: "0 24px" }}>
            <BreadcrumbNav
                items={[
                    { label: "Trang chủ", to: "/" },
                    { label: "Tài sản đấu giá" },
                ]}
            />

            <h2 style={{
                fontSize: "36px",
                fontWeight: 600,
                marginBottom: "28px",
                color: "#222"
            }}>
                {asset.description || "Chi tiết tài sản"}
            </h2>

            <div style={{ display: "flex", gap: 36, flexWrap: "wrap" }}>
                {/* Main Image Section */}
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
                                    src={img.url}
                                    alt={`thumb-${i}`}
                                    onClick={() => setMainImage(img.url)}
                                    style={{
                                        width: 72,
                                        height: 72,
                                        objectFit: "cover",
                                        borderRadius: 8,
                                        border: mainImage === img.url ? "3px solid #d32f2f" : "1px solid #ccc",
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

                {/* Asset Information Section */}
                <div style={{
                    flex: 2,
                    background: "#fff",
                    borderRadius: 12,
                    padding: "24px 28px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                    fontSize: 12,
                    color: "#333"
                }}>
                    <div style={{
                        textAlign: "center",
                        fontWeight: 800,
                        fontSize: 16,
                        margin: "20px 0 16px",
                        color: "#d32f2f"
                    }}>
                        Thông tin tài sản
                    </div>
                    {[
                        { label: "Mã tài sản", value: asset.document_code || asset.documentCode || "--" },
                        { label: "Giá khởi điểm", value: formatCurrency(asset.starting_price || asset.startingPrice) },
                        { label: "Bước giá", value: formatCurrency(asset.step_price || asset.stepPrice) },
                        { label: "Tiền đặt cọc", value: formatCurrency(asset.deposit_amount) },
                        { label: "Yêu cầu đặt cọc", value: asset.is_deposit_required ? "Có" : "Không" },
                        { label: "Loại đấu giá", value: getAuctionTypeText(asset.auction_type) },
                        { label: "Danh mục", value: asset.category?.name || asset.category_name || "--" },
                        { label: "Mô tả", value: asset.description || "--" }
                    ].map((item, index) => (
                        <div key={index} style={{
                            display: "flex",
                            alignItems: "flex-start",
                            marginBottom: 15,
                            borderBottom: "1px solid #f0f0f0",
                            paddingBottom: 10
                        }}>
                            <div style={{ minWidth: 140, fontWeight: "bold" }}>{item.label}:</div>
                            <div style={{
                                color: item.label === "Giá khởi điểm" || item.label === "Bước giá" || item.label === "Tiền đặt cọc" ? "#d32f2f" : "#333",
                                whiteSpace: "pre-line",
                                textAlign: "left",
                                flex: 1
                            }}>{item.value}</div>
                        </div>
                    ))}

                    {/* Auction Time Information */}
                    <div style={{
                        textAlign: "center",
                        fontWeight: 800,
                        fontSize: 16,
                        margin: "50px 0 16px",
                        color: "#d32f2f"
                    }}>
                        Thông tin đấu giá
                    </div>
                    {[

                        { label: "Thời gian bắt đầu", value: formatDateCustom(asset.session.start_time) },
                        { label: "Thời gian kết thúc", value: formatDateCustom(asset.session.end_time || asset.session?.endTime || asset.session.endTime) },
                        {
                            label: "Trạng thái",
                            value: (
                                <span style={{
                                    fontWeight: "bold",
                                    color: getStatusColor(asset.status || asset.session?.status)
                                }}>
                                    {getStatusText(asset.status || asset.session?.status)}
                                </span>
                            )
                        }
                    ].map((item, index) => (
                        <div key={index} style={{
                            display: "flex",
                            alignItems: "flex-start",
                            marginBottom: 12,
                            borderBottom: "1px solid #f0f0f0",
                            paddingBottom: 8
                        }}>
                            <div style={{ minWidth: 140, fontWeight: "bold" }}>{item.label}:</div>
                            <div style={{
                                color: item.label === "Trạng thái" ? "inherit" : "#333",
                                whiteSpace: "pre-line",
                                textAlign: "left",
                                flex: 1
                            }}>{item.value}</div>
                        </div>
                    ))}

                    {/* Owner Information */}
                    {asset.user && (
                        <>
                            <div style={{
                                textAlign: "center",
                                fontWeight: 800,
                                fontSize: 16,
                                margin: "20px 0 16px",
                                color: "#d32f2f"
                            }}>
                                Thông tin người bán
                            </div>
                            {[
                                { label: "Tên người dùng", value: asset.user.username || "--" },
                                { label: "Email", value: asset.user.email || "--" },
                                { label: "Số điện thoại", value: asset.user.phone_number || "--" }
                            ].map((item, index) => (
                                <div key={index} style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    marginBottom: 12,
                                    borderBottom: "1px solid #f0f0f0",
                                    paddingBottom: 8
                                }}>
                                    <div style={{ minWidth: 140, fontWeight: "bold" }}>{item.label}:</div>
                                    <div style={{
                                        color: "#333",
                                        whiteSpace: "pre-line",
                                        textAlign: "left",
                                        flex: 1
                                    }}>{item.value}</div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>

            {/* Tabbed Interface Section */}
            <div style={{ marginTop: 48 }}>
                {/* Tab Navigation */}
                <div style={{
                    display: "flex",
                    borderBottom: "2px solid #f0f0f0",
                    marginBottom: 24
                }}>
                    {[
                        { key: "description", label: "Chi tiết tài sản" },
                        { key: "auction-info", label: "Thông tin đấu giá" },
                        { key: "images", label: "Hình ảnh" }
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
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                <div>
                                    <h4 style={{ marginBottom: 30, fontWeight: 700, color: "#d32f2f" }}>Thông tin cơ bản:</h4>
                                    <p><strong>Mã tài sản:</strong> {asset.document_code || asset.documentCode || 'Chưa có'}</p>
                                    <p><strong>Mô tả:</strong> {asset.description || 'Chưa có mô tả'}</p>
                                    <p><strong>Giá khởi điểm:</strong> {formatCurrency(asset.starting_price || asset.startingPrice)}</p>
                                    <p><strong>Bước giá:</strong> {formatCurrency(asset.step_price || asset.stepPrice)}</p>
                                    <p><strong>Tiền đặt cọc:</strong> {formatCurrency(asset.deposit_amount)}</p>
                                    <p><strong>Danh mục:</strong> {asset.categoryName || asset.category_name || 'Chưa phân loại'}</p>
                                </div>
                                <div>
                                    <h4 style={{ marginBottom: 30, fontWeight: 700, color: "#d32f2f" }}>Trạng thái và thời gian:</h4>
                                    <p><strong>ID tài sản:</strong> {asset.id}</p>
                                    <p><strong>Trạng thái:</strong> {getStatusText(asset.status || asset.session?.status)}</p>
                                    <p><strong>Loại đấu giá:</strong> {getAuctionTypeText(asset.auction_type)}</p>
                                    <p><strong>Yêu cầu đặt cọc:</strong> {asset.is_deposit_required ? "Có" : "Không"}</p>
                                    <p><strong>Số lượng hình ảnh:</strong> {images.length} ảnh</p>
                                </div>
                            </div>
                            {asset.rejected_reason && (
                                <div style={{ marginTop: 20 }}>
                                    <h4 style={{ marginBottom: 12, fontWeight: 600, color: "#d32f2f" }}>Lý do từ chối:</h4>
                                    <p style={{ color: "#d32f2f", fontStyle: "italic" }}>{asset.rejected_reason}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "auction-info" && (
                        <div>
                            <h3 style={{ marginBottom: 16, fontSize: 18, fontWeight: 600 }}>Thông tin đấu giá</h3>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                <div>
                                    <h4 style={{ marginBottom: 12, fontWeight: 600, color: "#d32f2f" }}>Thông tin cơ bản:</h4>
                                    <p><strong>Loại đấu giá:</strong> {getAuctionTypeText(asset.auction_type)}</p>
                                    <p><strong>Giá khởi điểm:</strong> {formatCurrency(asset.starting_price || asset.startingPrice)}</p>
                                    <p><strong>Bước giá:</strong> {formatCurrency(asset.step_price || asset.stepPrice)}</p>
                                    <p><strong>Tiền đặt cọc:</strong> {formatCurrency(asset.deposit_amount)}</p>
                                    <p><strong>Yêu cầu đặt cọc:</strong> {asset.is_deposit_required ? "Có" : "Không"}</p>
                                    <p><strong>Trạng thái:</strong>
                                        <span style={{
                                            color: getStatusColor(asset.status),
                                            fontWeight: "bold",
                                            marginLeft: 8
                                        }}>
                                            {getStatusText(asset.status)}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <h4 style={{ marginBottom: 12, fontWeight: 600, color: "#d32f2f" }}>Thời gian:</h4>
                                    <p><strong>Đăng ký từ:</strong> {formatDateCustom(asset.registered_at)}</p>
                                    <p><strong>Bắt đầu:</strong> {formatDateCustom(asset.session.start_time)}</p>
                                    <p><strong>Kết thúc:</strong> {formatDateCustom(asset.session.end_time)}</p>
                                </div>
                            </div>
                            {asset.user && (
                                <div style={{ marginTop: 20 }}>
                                    <h4 style={{ marginBottom: 12, fontWeight: 600, color: "#d32f2f" }}>Thông tin người bán:</h4>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                        <div>
                                            <p><strong>Tên người dùng:</strong> {asset.user.username}</p>
                                            <p><strong>Email:</strong> {asset.user.email}</p>
                                        </div>
                                        <div>
                                            <p><strong>Số điện thoại:</strong> {asset.user.phone_number}</p>
                                            <p><strong>ID người dùng:</strong> {asset.user.id}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "images" && (
                        <div>
                            <h3 style={{ marginBottom: 16, fontSize: 18, fontWeight: 600 }}>
                                Hình ảnh tài sản ({images.length} ảnh)
                            </h3>
                            {images.length > 0 ? (
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                                    gap: 16
                                }}>
                                    {images.map((img, index) => (
                                        <div key={index} style={{
                                            position: "relative",
                                            borderRadius: 8,
                                            overflow: "hidden",
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                                        }}>
                                            <img
                                                src={img.url}
                                                alt={`Ảnh ${index + 1}`}
                                                style={{
                                                    width: "100%",
                                                    height: 200,
                                                    objectFit: "cover"
                                                }}
                                                onError={(e) => {
                                                    if (e.currentTarget.src !== window.location.origin + DEFAULT_IMG) {
                                                        e.currentTarget.src = DEFAULT_IMG;
                                                    }
                                                }}
                                            />
                                            <div style={{
                                                position: "absolute",
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                background: "rgba(0,0,0,0.7)",
                                                color: "white",
                                                padding: "8px 12px",
                                                fontSize: 12
                                            }}>
                                                Ảnh {index + 1}
                                                {img.type && (
                                                    <span style={{ marginLeft: 8, opacity: 0.8 }}>
                                                        ({img.type})
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{
                                    textAlign: "center",
                                    padding: 40,
                                    background: "#f9f9f9",
                                    borderRadius: 8,
                                    color: "#666"
                                }}>
                                    <p style={{ fontSize: 16, marginBottom: 8 }}>Chưa có hình ảnh</p>
                                    <p style={{ fontSize: 14, fontStyle: "italic" }}>
                                        Tài sản này chưa có hình ảnh nào được tải lên.
                                    </p>
                                </div>
                            )}
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
                    display: "flex",
                    gap: 24,
                    overflowX: "auto",
                    paddingBottom: 16
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
                                    src={relatedAsset.images?.[0]?.url || DEFAULT_IMG}
                                    alt={relatedAsset.description}
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
                            </div>

                            {/* Asset Info */}
                            <div style={{ padding: 20 }}>
                                <div style={{
                                    fontSize: 12,
                                    color: "#666",
                                    marginBottom: 8
                                }}>
                                    Mã: {relatedAsset.document_code}
                                </div>

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
                                    {relatedAsset.description || "Tài sản đấu giá"}
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
                                    onClick={() => navigate(`/assets/${relatedAsset.id}`)}
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

export default AssetDetail;