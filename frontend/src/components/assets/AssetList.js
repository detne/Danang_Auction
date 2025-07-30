// src/components/assets/AssetList.jsx
import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import useAssets from '../../hooks/organizer/useAssets';
import { assetAPI } from '../../services/asset';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { USER_ROLES, AUCTION_DOCUMENT_STATUS } from '../../utils/constants';
import { FaEdit, FaTrash, FaUpload, FaEye, FaPlus } from 'react-icons/fa';

const auctionTypeMap = {
    PUBLIC: 'Công khai',
    PRIVATE: 'Riêng tư'
};

const statusMap = {
    PENDING_CREATE: 'Chờ tạo',
    PENDING_APPROVAL: 'Chờ duyệt',
    APPROVED: 'Đã duyệt',
    REJECTED: 'Từ chối'
};

const getStatusColor = (status) => {
    const colorMap = {
        'APPROVED': '#2e7d32',
        'PENDING_APPROVAL': '#f9a825',
        'PENDING_CREATE': '#1976d2',
        'REJECTED': '#d32f2f'
    };
    return colorMap[status] || '#666';
};

// Helper function to get normalized status
const getNormalizedStatus = (asset) => {
    return (asset.status || 'PENDING_CREATE').toUpperCase();
};

const AssetList = () => {
    const { user, loading } = useUser();
    const navigate = useNavigate();
    const { assets, loading: assetsLoading, error, refetch } = useAssets();
    const [message, setMessage] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        if (!loading && user?.role !== USER_ROLES.ORGANIZER) navigate('/');
    }, [loading, user, navigate]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    useEffect(() => {
        if (error) setMessage(error);
    }, [error]);

    const handleEdit = (asset) => {
        navigate(`/asset-management/edit/${asset.id}`);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa tài sản này?')) return;
        setIsDeleting(true);
        try {
            const response = await assetAPI.deleteAsset(id);
            if (response.success) {
                setMessage('Xóa tài sản thành công!');
                refetch();
            } else {
                setMessage(response.message || 'Không thể xóa tài sản.');
            }
        } catch (error) {
            setMessage(`Lỗi: ${error.message || 'Không thể xóa tài sản.'}`);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleNewAsset = () => {
        navigate('/asset-management/new');
    };

    const handleUploadImages = (id) => {
        navigate(`/asset-management/${id}/upload-images`);
    };

    const handleViewDetail = (id) => {
        navigate(`/asset-management/detail/${id}`);
    };

    // Phân trang
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = assets.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(assets.length / itemsPerPage);

    if (loading || assetsLoading) {
        return (
            <div style={{ 
                maxWidth: "1280px", 
                margin: "40px auto", 
                padding: "0 24px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "400px"
            }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{
                        width: "40px",
                        height: "40px",
                        border: "4px solid #f0f0f0",
                        borderTop: "4px solid #d32f2f",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                        margin: "0 auto 16px"
                    }}></div>
                    <p style={{ color: "#666", fontSize: "16px" }}>Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (!user || user.role !== USER_ROLES.ORGANIZER) {
        return (
            <div style={{ 
                maxWidth: "1280px", 
                margin: "40px auto", 
                padding: "0 24px",
                textAlign: "center",
                minHeight: "400px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <div style={{
                    background: "#fff",
                    borderRadius: "12px",
                    padding: "40px",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.1)"
                }}>
                    <h3 style={{ color: "#d32f2f", marginBottom: "16px", fontSize: "24px" }}>
                        Không có quyền truy cập
                    </h3>
                    <p style={{ color: "#666", fontSize: "16px" }}>
                        Bạn cần có quyền quản lý để truy cập trang này.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "1280px", margin: "40px auto", padding: "0 24px" }}>
            {/* Header Section */}
            <div style={{ marginBottom: "28px" }}>
                <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "8px", 
                    marginBottom: "16px",
                    fontSize: "14px",
                    color: "#666"
                }}>
                    <span>Trang chủ</span>
                    <span>/</span>
                    <span style={{ color: "#d32f2f", fontWeight: "600" }}>Quản lý tài sản</span>
                </div>
                
                <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "16px"
                }}>
                    <div>
                        <h1 style={{
                            fontSize: "36px",
                            fontWeight: "600",
                            margin: "0 0 8px 0",
                            color: "#222"
                        }}>
                            Quản lý Tài sản Đấu giá
                        </h1>
                        <p style={{ 
                            color: "#666", 
                            fontSize: "16px", 
                            margin: "0" 
                        }}>
                            Tổng cộng: <strong>{assets.length}</strong> tài sản
                        </p>
                    </div>
                    
                    <button 
                        onClick={handleNewAsset}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "12px 24px",
                            fontSize: "16px",
                            fontWeight: "600",
                            backgroundColor: "#d32f2f",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            boxShadow: "0 2px 8px rgba(211, 47, 47, 0.3)"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#b71c1c";
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 4px 16px rgba(211, 47, 47, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#d32f2f";
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 2px 8px rgba(211, 47, 47, 0.3)";
                        }}
                    >
                        <FaPlus size={14} />
                        Thêm tài sản mới
                    </button>
                </div>
            </div>

            {/* Alert Message */}
            {message && (
                <div style={{
                    background: message.includes('thành công') ? "#e8f5e8" : "#ffebee",
                    border: `1px solid ${message.includes('thành công') ? "#4caf50" : "#f44336"}`,
                    borderRadius: "8px",
                    padding: "16px 20px",
                    marginBottom: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}>
                    <span style={{ 
                        color: message.includes('thành công') ? "#2e7d32" : "#d32f2f",
                        fontWeight: "500"
                    }}>
                        {message}
                    </span>
                    <button 
                        onClick={() => setMessage('')}
                        style={{
                            background: "none",
                            border: "none",
                            fontSize: "20px",
                            cursor: "pointer",
                            color: message.includes('thành công') ? "#2e7d32" : "#d32f2f",
                            padding: "0",
                            width: "24px",
                            height: "24px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Main Content */}
            <div style={{
                background: "#fff",
                borderRadius: "12px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                overflow: "hidden"
            }}>
                {assets.length === 0 ? (
                    <div style={{
                        textAlign: "center",
                        padding: "80px 40px",
                        color: "#666"
                    }}>
                        <div style={{
                            fontSize: "48px",
                            marginBottom: "24px",
                            color: "#ddd"
                        }}>
                            📦
                        </div>
                        <h3 style={{ 
                            fontSize: "24px", 
                            fontWeight: "600", 
                            marginBottom: "16px",
                            color: "#333"
                        }}>
                            Chưa có tài sản nào
                        </h3>
                        <p style={{ 
                            fontSize: "16px", 
                            marginBottom: "32px",
                            lineHeight: "1.5"
                        }}>
                            Hãy thêm tài sản đầu tiên để bắt đầu quản lý đấu giá!
                        </p>
                        <button 
                            onClick={handleNewAsset}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "12px 24px",
                                fontSize: "16px",
                                fontWeight: "600",
                                backgroundColor: "#d32f2f",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                                transition: "all 0.3s ease"
                            }}
                        >
                            <FaPlus size={14} />
                            Thêm tài sản mới
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Table */}
                        <div style={{ overflow: "auto" }}>
                            <table style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                fontSize: "14px"
                            }}>
                                <thead>
                                    <tr style={{ 
                                        background: "#f8f9fa",
                                        borderBottom: "2px solid #e9ecef"
                                    }}>
                                        <th style={{ padding: "16px 12px", textAlign: "left", fontWeight: "600", color: "#495057", minWidth: "120px" }}>
                                            Mã tài sản
                                        </th>
                                        <th style={{ padding: "16px 12px", textAlign: "left", fontWeight: "600", color: "#495057", minWidth: "100px" }}>
                                            Loại đấu giá
                                        </th>
                                        <th style={{ padding: "16px 12px", textAlign: "left", fontWeight: "600", color: "#495057", minWidth: "120px" }}>
                                            Tiền đặt cọc
                                        </th>
                                        <th style={{ padding: "16px 12px", textAlign: "left", fontWeight: "600", color: "#495057", minWidth: "200px" }}>
                                            Mô tả
                                        </th>
                                        <th style={{ padding: "16px 12px", textAlign: "left", fontWeight: "600", color: "#495057", minWidth: "140px" }}>
                                            Bắt đầu
                                        </th>
                                        <th style={{ padding: "16px 12px", textAlign: "left", fontWeight: "600", color: "#495057", minWidth: "140px" }}>
                                            Kết thúc
                                        </th>
                                        <th style={{ padding: "16px 12px", textAlign: "left", fontWeight: "600", color: "#495057", minWidth: "120px" }}>
                                            Giá khởi điểm
                                        </th>
                                        <th style={{ padding: "16px 12px", textAlign: "left", fontWeight: "600", color: "#495057", minWidth: "100px" }}>
                                            Bước giá
                                        </th>
                                        <th style={{ padding: "16px 12px", textAlign: "left", fontWeight: "600", color: "#495057", minWidth: "100px" }}>
                                            Trạng thái
                                        </th>
                                        <th style={{ padding: "16px 12px", textAlign: "center", fontWeight: "600", color: "#495057", minWidth: "200px" }}>
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((asset, index) => {
                                        const normalizedStatus = getNormalizedStatus(asset);
                                        return (
                                            <tr key={asset.id} style={{
                                                borderBottom: "1px solid #e9ecef",
                                                backgroundColor: index % 2 === 0 ? "#fff" : "#f8f9fa",
                                                transition: "background-color 0.2s ease"
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = "#e3f2fd";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#fff" : "#f8f9fa";
                                            }}
                                            >
                                                <td style={{ padding: "16px 12px" }}>
                                                    <div style={{ fontWeight: "600", color: "#333" }}>
                                                        {asset.document_code || asset.documentCode || "--"}
                                                    </div>
                                                </td>
                                                <td style={{ padding: "16px 12px" }}>
                                                    <span style={{
                                                        padding: "4px 8px",
                                                        borderRadius: "4px",
                                                        fontSize: "12px",
                                                        fontWeight: "500",
                                                        backgroundColor: (asset.auction_type || asset.auctionType) === 'PUBLIC' ? "#e3f2fd" : "#f3e5f5",
                                                        color: (asset.auction_type || asset.auctionType) === 'PUBLIC' ? "#1976d2" : "#7b1fa2"
                                                    }}>
                                                        {auctionTypeMap[asset.auction_type || asset.auctionType] || 'Chưa xác định'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: "16px 12px" }}>
                                                    <div style={{ color: "#d32f2f", fontWeight: "500" }}>
                                                        {(asset.deposit_amount || asset.depositAmount)
                                                            ? formatCurrency(asset.deposit_amount || asset.depositAmount)
                                                            : <span style={{ color: "#666", fontStyle: "italic" }}>Không yêu cầu</span>
                                                        }
                                                    </div>
                                                </td>
                                                <td style={{ padding: "16px 12px" }}>
                                                    <div style={{ 
                                                        maxWidth: "200px",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap"
                                                    }} title={asset.description}>
                                                        {asset.description || <span style={{ color: "#666", fontStyle: "italic" }}>Chưa có mô tả</span>}
                                                    </div>
                                                </td>
                                                <td style={{ padding: "16px 12px", fontSize: "12px", color: "#666" }}>
                                                    {(asset.start_time || asset.startTime)
                                                        ? formatDate(asset.start_time || asset.startTime)
                                                        : <span style={{ fontStyle: "italic" }}>Chưa xác định</span>
                                                    }
                                                </td>
                                                <td style={{ padding: "16px 12px", fontSize: "12px", color: "#666" }}>
                                                    {(asset.end_time || asset.endTime)
                                                        ? formatDate(asset.end_time || asset.endTime)
                                                        : <span style={{ fontStyle: "italic" }}>Chưa xác định</span>
                                                    }
                                                </td>
                                                <td style={{ padding: "16px 12px" }}>
                                                    <div style={{ color: "#d32f2f", fontWeight: "600" }}>
                                                        {(asset.starting_price || asset.startingPrice)
                                                            ? formatCurrency(asset.starting_price || asset.startingPrice)
                                                            : <span style={{ color: "#666", fontStyle: "italic" }}>Chưa xác định</span>
                                                        }
                                                    </div>
                                                </td>
                                                <td style={{ padding: "16px 12px" }}>
                                                    <div style={{ color: "#333", fontWeight: "500" }}>
                                                        {(asset.step_price || asset.stepPrice)
                                                            ? formatCurrency(asset.step_price || asset.stepPrice)
                                                            : <span style={{ color: "#666", fontStyle: "italic" }}>Chưa xác định</span>
                                                        }
                                                    </div>
                                                </td>
                                                <td style={{ padding: "16px 12px" }}>
                                                    <span style={{
                                                        padding: "6px 12px",
                                                        borderRadius: "6px",
                                                        fontSize: "12px",
                                                        fontWeight: "600",
                                                        backgroundColor: getStatusColor(normalizedStatus) + "20",
                                                        color: getStatusColor(normalizedStatus),
                                                        border: `1px solid ${getStatusColor(normalizedStatus)}40`
                                                    }}>
                                                        {statusMap[normalizedStatus] || 'Chờ tạo'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: "16px 12px" }}>
                                                    <div style={{ 
                                                        display: "flex", 
                                                        gap: "6px", 
                                                        justifyContent: "center",
                                                        flexWrap: "wrap"
                                                    }}>
                                                        {/* Button Xem - Always show */}
                                                        <button
                                                            onClick={() => handleViewDetail(asset.id)}
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "4px",
                                                                padding: "6px 10px",
                                                                fontSize: "12px",
                                                                fontWeight: "500",
                                                                backgroundColor: "#e3f2fd",
                                                                color: "#1976d2",
                                                                border: "1px solid #1976d240",
                                                                borderRadius: "4px",
                                                                cursor: "pointer",
                                                                transition: "all 0.2s ease"
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.backgroundColor = "#1976d2";
                                                                e.currentTarget.style.color = "white";
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.backgroundColor = "#e3f2fd";
                                                                e.currentTarget.style.color = "#1976d2";
                                                            }}
                                                            title="Xem chi tiết"
                                                        >
                                                            <FaEye size={10} />
                                                            Xem
                                                        </button>
                                                        
                                                        {/* Button Sửa - Only show for PENDING_CREATE status */}
                                                        {normalizedStatus === 'PENDING_CREATE' && (
                                                            <button
                                                                onClick={() => handleEdit(asset)}
                                                                style={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    gap: "4px",
                                                                    padding: "6px 10px",
                                                                    fontSize: "12px",
                                                                    fontWeight: "500",
                                                                    backgroundColor: "#e8f5e8",
                                                                    color: "#2e7d32",
                                                                    border: "1px solid #2e7d3240",
                                                                    borderRadius: "4px",
                                                                    cursor: "pointer",
                                                                    transition: "all 0.2s ease"
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    e.currentTarget.style.backgroundColor = "#2e7d32";
                                                                    e.currentTarget.style.color = "white";
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.currentTarget.style.backgroundColor = "#e8f5e8";
                                                                    e.currentTarget.style.color = "#2e7d32";
                                                                }}
                                                                title="Chỉnh sửa"
                                                            >
                                                                <FaEdit size={10} />
                                                                Sửa
                                                            </button>
                                                        )}
                                                        
                                                        {/* Button Ảnh - Show for all statuses except REJECTED */}
                                                        {normalizedStatus !== 'REJECTED' && (
                                                            <button
                                                                onClick={() => handleUploadImages(asset.id)}
                                                                style={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    gap: "4px",
                                                                    padding: "6px 10px",
                                                                    fontSize: "12px",
                                                                    fontWeight: "500",
                                                                    backgroundColor: "#fff3e0",
                                                                    color: "#f57c00",
                                                                    border: "1px solid #f57c0040",
                                                                    borderRadius: "4px",
                                                                    cursor: "pointer",
                                                                    transition: "all 0.2s ease"
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    e.currentTarget.style.backgroundColor = "#f57c00";
                                                                    e.currentTarget.style.color = "white";
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.currentTarget.style.backgroundColor = "#fff3e0";
                                                                    e.currentTarget.style.color = "#f57c00";
                                                                }}
                                                                title="Tải ảnh"
                                                            >
                                                                <FaUpload size={10} />
                                                                Ảnh
                                                            </button>
                                                        )}
                                                        
                                                        {/* Button Xoá - Only show for PENDING_CREATE and REJECTED statuses */}
                                                        {(normalizedStatus === 'PENDING_CREATE' || normalizedStatus === 'REJECTED') && (
                                                            <button
                                                                onClick={() => handleDelete(asset.id)}
                                                                disabled={isDeleting}
                                                                style={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    gap: "4px",
                                                                    padding: "6px 10px",
                                                                    fontSize: "12px",
                                                                    fontWeight: "500",
                                                                    backgroundColor: "#ffebee",
                                                                    color: "#d32f2f",
                                                                    border: "1px solid #d32f2f40",
                                                                    borderRadius: "4px",
                                                                    cursor: isDeleting ? "not-allowed" : "pointer",
                                                                    opacity: isDeleting ? 0.6 : 1,
                                                                    transition: "all 0.2s ease"
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    if (!isDeleting) {
                                                                        e.currentTarget.style.backgroundColor = "#d32f2f";
                                                                        e.currentTarget.style.color = "white";
                                                                    }
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    if (!isDeleting) {
                                                                        e.currentTarget.style.backgroundColor = "#ffebee";
                                                                        e.currentTarget.style.color = "#d32f2f";
                                                                    }
                                                                }}
                                                                title="Xóa"
                                                            >
                                                                <FaTrash size={10} />
                                                                Xoá
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "20px 24px",
                                borderTop: "1px solid #e9ecef",
                                background: "#f8f9fa"
                            }}>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        padding: "8px 16px",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        backgroundColor: currentPage === 1 ? "#f0f0f0" : "#fff",
                                        color: currentPage === 1 ? "#999" : "#333",
                                        border: "1px solid #ddd",
                                        borderRadius: "6px",
                                        cursor: currentPage === 1 ? "not-allowed" : "pointer",
                                        transition: "all 0.2s ease"
                                    }}
                                >
                                    ← Trước
                                </button>

                                <div style={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    gap: "16px",
                                    fontSize: "14px",
                                    color: "#666"
                                }}>
                                    <span>
                                        Trang <strong>{currentPage}</strong> / <strong>{totalPages}</strong>
                                    </span>
                                    <span>|</span>
                                    <span>
                                        Hiển thị <strong>{indexOfFirstItem + 1}</strong> - <strong>{Math.min(indexOfLastItem, assets.length)}</strong> / <strong>{assets.length}</strong>
                                    </span>
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        padding: "8px 16px",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        backgroundColor: currentPage === totalPages ? "#f0f0f0" : "#fff",
                                        color: currentPage === totalPages ? "#999" : "#333",
                                        border: "1px solid #ddd",
                                        borderRadius: "6px",
                                        cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                                        transition: "all 0.2s ease"
                                    }}
                                >
                                    Sau →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Loading Animation CSS */}
            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default AssetList;